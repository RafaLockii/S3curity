import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getLogoeCarrossel = async (req: Request, res: Response) => {
    try {
        const { empresa } = req.params;

        const empresaFind = await prisma.empresa.findUnique({
            where: {
                nome: empresa,
            },
            include: {
                carrosseis: true,
            },
        });

        if (empresaFind) {
            const formattedEmpresa = {
                ...empresaFind,
                data_criacao: empresaFind.data_criacao.toLocaleString(),
            };

            res.status(200).json(formattedEmpresa);
        } else {
            res.status(404).json({ message: 'Empresa não encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};