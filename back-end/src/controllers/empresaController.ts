import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createEmpresa = async (req: Request, res: Response) => {
    const {
        nome,
        razao_s,
        logo,
        imagem_fundo,
        usuario_criacao,
        carrosselImagens
    } = req.body;

    if (!nome || !razao_s || !logo || !imagem_fundo || !usuario_criacao) {
        return res.status(400).json({ message: 'Dados de entrada inválidos.' });
    }

    try {
        const existingEmpresa = await prisma.empresa.findUnique({
            where: {
                nome,
            },
        });

        if (existingEmpresa) {
            return res.status(400).json({ message: 'A empresa já existe.' });
        }

        const currentDatetime = new Date();
        currentDatetime.setHours(currentDatetime.getHours() - 3);

        const empresa = await prisma.empresa.create({
            data: {
                nome,
                razao_s,
                logo,
                imagem_fundo,
                data_criacao: currentDatetime, 
                usuario_criacao,
            },
        });

        if(carrosselImagens.length > 0){
            const carrossel = await prisma.carrossel.createMany({
                data: carrosselImagens.map((imagem: string) => ({
                    nome: imagem,
                    empresa_id: empresa.id,
                    data_criacao: currentDatetime,
                })),
            });
        }

        res.status(201).json({ empresa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar empresa' });
    }
}; 

export const editEmpresa = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        nome,
        razao_s,
        logo,
        imagem_fundo,
        usuario_criacao,
        carrosselImagens
    } = req.body;

    if (!nome || !razao_s || !logo || !imagem_fundo || !usuario_criacao) {
        return res.status(400).json({ message: 'Dados de entrada inválidos.' });
    }

    try {
        const currentDatetime = new Date();
        currentDatetime.setHours(currentDatetime.getHours() - 3);
    
        const empresa = await prisma.empresa.update({
            where: { id: Number(id) },
            data: {
                nome,
                razao_s,
                logo,
                imagem_fundo,
                data_alt: currentDatetime, 
                usuario_cad_alt: usuario_criacao,
            },
        });
    
        if(carrosselImagens.length > 0){
            await prisma.carrossel.deleteMany({
                where: { empresa_id: Number(id) },
            });

            await prisma.carrossel.createMany({
                data: carrosselImagens.map((imagem: string) => ({
                    nome: imagem,
                    empresa_id: empresa.id,
                    data_criacao: currentDatetime,
                })),
            });
        }
    
        res.status(200).json({ empresa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar empresa' });
    }
};

export const deleteEmpresa = async (req: Request, res: Response) => {
    const empresaId = parseInt(req.params.id);

    try {
        const existingEmpresa = await prisma.empresa.findUnique({
            where: { id: empresaId },
        });

        if (!existingEmpresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        await prisma.carrossel.deleteMany({
            where: { empresa_id: empresaId },
        });

        await prisma.funcionario.deleteMany({
            where: { empresa_id: empresaId },
        });

        await prisma.empresa.delete({
            where: { id: empresaId },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir a empresa.' });
    }
};

export const listEmpresas = async (req: Request, res: Response) => {
    try {
        const empresas = await prisma.empresa.findMany({
            include: {
                carrosseis: true,
                funcionarios: true,
            },
        });

        const formattedEmpresas = empresas.map((empresa) => ({
            ...empresa,
            data_criacao: empresa.data_criacao.toLocaleString(),
            carrosseis: empresa.carrosseis.map((carrossel) => ({
                ...carrossel,
                data_criacao: carrossel.data_criacao.toLocaleString(),
            })),
        }));

        res.status(200).json(formattedEmpresas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar as empresas.' });
    }
};

export const getEmpresa = async (req: Request, res: Response) => {
    const empresaId = parseInt(req.params.id);

    try {
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId },
            include: {
                carrosseis: true,
                funcionarios: true,
            },
        });

        if (!empresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        const formattedEmpresa = {
            id: empresa.id,
            nome: empresa.nome,
            razao_s: empresa.razao_s,
            logo: empresa.logo,
            data_alt: empresa.data_alt,
            imagem_fundo: empresa.imagem_fundo,
            usuario_criacao: empresa.usuario_criacao,
            data_criacao: empresa.data_criacao.toLocaleString(),
            usuario_cad_alt: empresa.usuario_cad_alt,
            carrosseis: empresa.carrosseis,
            numero_funcionarios: empresa.funcionarios.length,
        };

        res.status(200).json(formattedEmpresa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar as informações da empresa.' });
    }
};

export const getEmpresaByName = async (req: Request, res: Response) => {
    const  nome  = req.params.nome;

    try {
        const empresa = await prisma.empresa.findUnique({
            where: {
                nome: nome,
            },
            include: {
                carrosseis: true,
                funcionarios: true,
            },
        });

        if (!empresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        const formattedEmpresa = {
            id: empresa.id,
            nome: empresa.nome,
            razao_s: empresa.razao_s,
            logo: empresa.logo,
            data_alt: empresa.data_alt,
            imagem_fundo: empresa.imagem_fundo,
            usuario_criacao: empresa.usuario_criacao,
            data_criacao: empresa.data_criacao.toLocaleString(),
            usuario_cad_alt: empresa.usuario_cad_alt,
            carrosseis: empresa.carrosseis,
        };

        if (!formattedEmpresa) {
            res.status(404).json({ error: "Empresa not found" });
            return;
        }

        res.status(200).json({ formattedEmpresa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get empresa" });
    }
};