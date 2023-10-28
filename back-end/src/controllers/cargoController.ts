import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createCargo = async (req: Request, res: Response) => {
    try {
        const { nome_cargo, permissoes } = req.body;

        const cargo = await prisma.cargos.create({
            data: {
            nome_cargo,
            permissoes,
            },
        });

            res.status(201).json(cargo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar o cargo.' });
        } finally {
        await prisma.$disconnect();
        }
};

export const getAllCargos = async (req: Request, res: Response) => {
    try {
    const cargos = await prisma.cargos.findMany();
        res.json(cargos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar os cargos.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const getCargoById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const cargo = await prisma.cargos.findUnique({
        where: {
            cargo_id: parseInt(id),
        },
        });

        if (!cargo) {
        return res.status(404).json({ message: 'Cargo não encontrado.' });
        }

        res.json(cargo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o cargo.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const updateCargo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome_cargo, permissoes } = req.body;

    try {
        const updatedCargo = await prisma.cargos.update({
        where: {
            cargo_id: parseInt(id),
        },
        data: {
            nome_cargo,
            permissoes,
        },
        });

        res.json(updatedCargo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar o cargo.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const deleteCargo = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.cargos.delete({
        where: {
            cargo_id: parseInt(id),
        },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir o cargo.' });
    } finally {
        await prisma.$disconnect();
    }
};
