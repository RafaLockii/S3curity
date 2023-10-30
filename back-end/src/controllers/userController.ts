import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            nome,
            senha,
            email,
            telefone,
            data_criacao,
            usuario_criacao,
            modulo_default,
            acesso_admin,
            cargo_id,
            empresa_id,
            imagem_perfil_url,
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'O e-mail já está em uso.' });
        }

        const existingEmpresa = await prisma.empresa.findUnique({
            where: {
                id: empresa_id,
            },
        });

        if (!existingEmpresa) {
            return res.status(400).json({ message: 'A empresa especificada não foi encontrada.' });
        }

        const createdImagem = await prisma.imagem.create({
            data: {
                url: imagem_perfil_url,
            },
        });

        const user = await prisma.user.create({
            data: {
                nome,
                senha,
                email,
                telefone,
                funcionario: {
                    create: {
                        ativo: true,
                        cadastro_alterado: new Date(data_criacao),
                        usuario_cad_alt: usuario_criacao,
                        modulo_default,
                        acesso_admin,
                        empresa: { connect: { id: empresa_id } },
                        imagem: { connect: { id: createdImagem.id } },
                        cargo: { connect: { cargo_id: cargo_id } },
                    },
                },
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar o usuário.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const editUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const {
            nome,
            senha,
            email,
            telefone,
            modulo_default,
            acesso_admin,
            cargo_id,
            empresa_id,
            imagem_perfil_url,
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                funcionario: true,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Atualize as informações do usuário no banco de dados
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                nome,
                senha,
                email,
                telefone,
            },
        });

        const existingEmpresa = await prisma.empresa.findUnique({
            where: {
                id: empresa_id,
            },
        });

        if (!existingEmpresa) {
            return res.status(404).json({ message: 'Empresa não encontrado.' });
        }

        if (existingUser.funcionario) {
            const updatedFuncionario = await prisma.funcionario.update({
                where: {
                    id: existingUser.funcionario.id,
                },
                data: {
                    modulo_default,
                    acesso_admin,
                    empresa: {connect: {id: empresa_id}},
                    cargo: { connect: { cargo_id: cargo_id } },
                },
            });
        }

        if (imagem_perfil_url) {
            if (existingUser.funcionario?.imagem_perfil_id) {
                const updatedImagem = await prisma.imagem.update({
                    where: {
                        id: existingUser.funcionario.imagem_perfil_id,
                    },
                    data: {
                        url: imagem_perfil_url,
                    },
                });
            }
            else{
                const createdImagem = await prisma.imagem.create({
                    data: {
                        url: imagem_perfil_url,
                    },
                });

                const atualizarImagem = await prisma.funcionario.update({
                    where:{
                        id: existingUser.funcionario?.id,
                    },
                    data:{
                        imagem_perfil_id: createdImagem.id
                    }
                })
            }
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao editar o usuário.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const getUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                funcionario: {
                    include: {
                        imagem: true,
                        cargo: true,
                        empresa: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar as informações do usuário.' });
    }
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                funcionario: {
                    include: {
                        imagem: true,
                        cargo: true,
                        empresa: true,
                    },
                },
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar os usuários.' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    try {
        const editingUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                funcionario: {
                    include: {
                        imagem: true,
                        cargo: true,
                        empresa: true,
                    },
                },
            },
        });

        if (!editingUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (!editingUser.funcionario) {
            return res.status(500).json({ message: 'Usuário não possui informações de funcionário.' });
        }

        await prisma.funcionario.delete({
            where: { id: editingUser.funcionario.id },
        });

        await prisma.imagem.delete({
            where: { id: editingUser.funcionario.imagem_perfil_id },
        });

        // if (editingUser.funcionario.empresa) {
        //     await prisma.empresa.delete({
        //         where: { id: editingUser.funcionario.empresa.id },
        //     });
        // }

        await prisma.user.delete({
            where: { id: userId },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir o usuário.' });
    }
};

