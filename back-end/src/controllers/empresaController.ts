import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createEmpresa = async (req: Request, res: Response) => {
    try {
        const {
            nome,
            razao_s,
            logo,
            imagem_fundo,
            data_criacao,
            usuario_criacao,
        } = req.body;

        const existingEmpresa = await prisma.empresa.findUnique({
            where: {
                nome,
            },
        });

        if (existingEmpresa) {
            return res.status(400).json({ message: 'A empresa já existe.' });
        }

        const empresa = await prisma.empresa.create({
            data: {
                nome,
                razao_s,
                logo,
                imagem_fundo,
                data_criacao,
                usuario_criacao,
            },
        });

        res.status(201).json(empresa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar a empresa.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const editEmpresa = async (req: Request, res: Response) => {
    const empresaId = parseInt(req.params.id);
    const { nome, razao_s, logo, imagem_fundo, data_alt, usuario_cad_alt } = req.body;

    try {
        const existingEmpresa = await prisma.empresa.findUnique({
            where: { id: empresaId },
        });

        if (!existingEmpresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        const updatedEmpresa = await prisma.empresa.update({
            where: { id: empresaId },
            data: {
                nome,
                razao_s,
                logo,
                imagem_fundo,
                data_alt: new Date(data_alt),
                usuario_cad_alt,
            },
        });

        res.status(200).json(updatedEmpresa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao editar a empresa.' });
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
        const empresas = await prisma.empresa.findMany();
        res.status(200).json(empresas);
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
        });

        if (!empresa) {
        return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        res.status(200).json(empresa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar as informações da empresa.' });
    }
};