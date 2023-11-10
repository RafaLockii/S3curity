import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { transporter } from '../services/nodemailer';
import bcrypt from 'bcrypt';
const speakeasy = require('speakeasy');

export const createUser = async (req: Request, res: Response) => {
    const {
        nome,
        senha,
        email,
        telefone,
        usuario_criacao,
        modulo_default,
        acesso_admin,
        cargo_id,
        empresa_id,
        imagem_perfil_url,
    } = req.body;
    
    try {

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

        const hashedPassword = await bcrypt.hash(senha, 10);

        const createdImagem = await prisma.imagem.create({
            data: {
                url: imagem_perfil_url,
            },
        });

        const secret = speakeasy.generateSecret({ length: 6 });
        const code = secret.base32;

        const currentDatetime = new Date();

        const user = await prisma.user.create({
            data: {
                nome,
                senha: hashedPassword,
                email,
                telefone,
                token: code,
                funcionario: {
                    create: {
                        ativo: true,
                        cadastro_alterado: currentDatetime,
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

        if(user.token){
            transporter.sendMail(
                {
                    from: 'jocyannovittor@hotmail.com',
                    to: email,
                    subject: 'Código de Ativação de Usuário',
                    text: `Seu Token de Ativação é: ${code}`,
                },
                (error: Error, info: any) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('Chave secreta 2FA enviada com sucesso: ' + info.response);
                    }
                }
            );
        }

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
            ativo,
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

        if(empresa_id && cargo_id){
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
                        ativo: ativo,
                        acesso_admin,
                        empresa: {connect: {id: empresa_id}},
                        cargo: { connect: { cargo_id: cargo_id } },
                    },
                });
            }
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

        const formattedUser = {
            ...user,
            funcionario: {
                ...user.funcionario,
                cadastro_alterado: user.funcionario?.cadastro_alterado?.toLocaleString() || null,
                empresa: {
                    ...user.funcionario?.empresa,
                    data_criacao: user.funcionario?.empresa?.data_criacao?.toLocaleString() || null,
                },
            },
        };

        res.status(200).json(formattedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar as informações do usuário.' });
    }
};

export const listUsers = async (req: Request, res: Response) => {
    const empresaNome = req.params.empresa;

    try {
        if (empresaNome === "sec3rity") { 
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

            const formattedUsers = users.map((user) => ({
                ...user,
                funcionario: {
                    ...user.funcionario,
                    cadastro_alterado: user.funcionario?.cadastro_alterado?.toLocaleString() || null,
                    empresa: {
                        ...user.funcionario?.empresa,
                        data_criacao: user.funcionario?.empresa?.data_criacao?.toLocaleString() || null,
                    },
                },
            }));

            res.status(200).json(formattedUsers);
        } else {
            const empresa = await prisma.empresa.findUnique({
                where: {
                    nome: empresaNome,
                },
            });

            if (!empresa) {
                return res.status(404).json({ message: 'Empresa não encontrada.' });
            }

            const users = await prisma.user.findMany({
                where: {
                    funcionario: {
                        empresa_id: empresa.id,
                    },
                },
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

            const formattedUsers = users.map((user) => ({
                ...user,
                funcionario: {
                    ...user.funcionario,
                    cadastro_alterado: user.funcionario?.cadastro_alterado?.toLocaleString() || null,
                    empresa: {
                        ...user.funcionario?.empresa,
                        data_criacao: user.funcionario?.empresa?.data_criacao?.toLocaleString() || null,
                    },
                },
            }));

            res.status(200).json(formattedUsers);
        }
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
        
        if(editingUser.funcionario.id){
            await prisma.funcionario.delete({
                where: { id: editingUser.funcionario.id },
            });
        }

        if(editingUser.funcionario.imagem_perfil_id){
            await prisma.imagem.delete({
                where: { id: editingUser.funcionario.imagem_perfil_id },
            });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir o usuário.' });
    }
};

export const ativarUser = async (req: Request, res: Response) => {

    const { email, token } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if(user.verified == true){
            return res.status(404).json({ message: 'Usuário já se encontra ativo.' });
        }

        const userVerified = await prisma.user.findFirst({
            where: {
                email: email,
                token: token,
                verified: false
            },
        });

        if (!userVerified) {
            return res.status(400).json({ message: 'Falha ao verificar usuário' });
        }

        if (userVerified) {

            await prisma.user.update({
                where: {
                    email: email,
                },
                data: {
                    verified: true,
                }
            })

            return res.status(200).json({ message: 'Usuário ativado com sucesso.' });
        } else {
            return res.status(401).json({ message: 'Código Token inválido.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao verificar o 2FA e atualizar a senha.' });
    }
}
