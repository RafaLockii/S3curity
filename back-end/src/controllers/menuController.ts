import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createModulos = async (req: Request, res: Response) => {
    try {
        const { modulos } = req.body;

        const createdModulos = await prisma.modulos.createMany({
            data: modulos.map((modulo: any) => ({
                nome: modulo.nome,
            })),
        });

        res.status(201).json({ modulos: createdModulos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Modulos creation failed" });
    } finally {
        await prisma.$disconnect();
    }
};

export const createMenu = async (req: Request, res: Response) => {
    try {
        const {
            nomeMenu,
            itens,
            empresa_id,
            modulo_id,
        } = req.body;

        const modulo = await prisma.modulos.findUnique({
            where: { id: modulo_id },
        });

        if (!modulo) {
            return res.status(404).json({ error: "Modulo not found" });
        }

        const createdMenu = await prisma.menus.create({
            data: {
                nome: nomeMenu,
                modulos: {
                    connect: { id: modulo_id },
                },
                empresa: {
                    connect: { id: empresa_id },
                },
                itens: {
                    create: itens.map((item: any) => ({
                        nome: item.nomeItem,
                        relatorios: {
                            create: item.relatorios.map((relatorio: any) => ({
                                nome: relatorio.nome,
                                relatorio: relatorio.relatorio,
                            })),
                        },
                    })),
                },
            },
        });

        res.status(201).json({ menu: createdMenu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Item creation failed" });
    } finally {
        await prisma.$disconnect();
    }
};

export const editMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nomeMenu, itens } = req.body;

        const menu = await prisma.menus.findUnique({
            where: { id: Number(id) },
        });

        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }

        const updatedMenu = await prisma.menus.update({
            where: { id: Number(id) },
            data: {
                nome: nomeMenu,
                itens: {
                    update: itens.map((item: any) => ({
                        where: { id: item.id },
                        data: {
                            nome: item.nomeItem,
                            relatorios: {
                                update: item.relatorios.map((relatorio: any) => ({
                                    where: { id: relatorio.id },
                                    data: {
                                        nome: relatorio.nome,
                                        relatorio: relatorio.relatorio,
                                    },
                                })),
                            },
                        },
                    })),
                },
            },
        });

        res.status(200).json({ menu: updatedMenu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Item update failed" });
    } finally {
        await prisma.$disconnect();
    }
};

export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const menu = await prisma.menus.findUnique({
            where: { id: Number(id) },
            include: { itens: { include: { relatorios: true } } },
        });

        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }

        for (const item of menu.itens) {
            for (const relatorio of item.relatorios) {
                await prisma.relatorios.delete({
                    where: { id: relatorio.id },
                });
            }

            await prisma.itens.delete({
                where: { id: item.id },
            });
        }

        await prisma.menus.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: "Menu deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Item deletion failed" });
    } finally {
        await prisma.$disconnect();
    }
};

export const getMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const menu = await prisma.menus.findUnique({
            where: { id: Number(id) },
            include: { itens: { include: { relatorios: true } } },
        });

        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }

        res.status(200).json({ menu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menu" });
    } finally {
        await prisma.$disconnect();
    }
};

export const getMenusByEmpresaAndModulo = async (req: Request, res: Response) => {
    const { empresa_id, modulo_id } = req.params;

    try {
        const menus = await prisma.menus.findMany({
            where: {
                empresa_id: Number(empresa_id),
                modulos_id: Number(modulo_id),
            },
            include: {
                empresa: true,
                modulos: true,
                itens: {
                    include: {
                        relatorios: true,
                    },
                },
            },
        });

        const formattedMenus = menus.map(menu => ({
            ...menu,
            empresa: menu.empresa.nome,
            modulo: menu.modulos.nome,
        }));

        res.status(200).json({ menus: formattedMenus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    } finally {
        await prisma.$disconnect();
    }
};

export const getAllMenus = async (req: Request, res: Response) => {
    try {
        const menus = await prisma.menus.findMany({
            include: {
                empresa: true,
                modulos: true,
                itens: { include: { relatorios: true } },
            },
        });

        const formattedMenus = menus.map(menu => ({
            id: menu.id,
            nome: menu.nome,
            empresa: menu.empresa.nome,
            modulo: menu.modulos.nome,
            itens: menu.itens
        }));

        res.status(200).json({ menus: formattedMenus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    } finally {
        await prisma.$disconnect();
    }
};