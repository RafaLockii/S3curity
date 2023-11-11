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
    }
};

export const createMenu = async (req: Request, res: Response) => {
    const {
        nomeMenu,
        itens,
        empresa_id,
        modulo_id,
    } = req.body;
    
    try {

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
    }
};

export const createMenuUser = async (req: Request, res: Response) => {
    const { funcionario_id, menus_ids } = req.body;

    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id: funcionario_id },
        });

        if (!funcionario) {
            return res.status(404).json({ error: "Funcionario not found" });
        }

        const menus = await prisma.menus.findMany({
            where: { id: { in: menus_ids } },
        });

        if (menus.length !== menus_ids.length) {
            return res.status(404).json({ error: "One or more menus not found" });
        }

        const existingFuncionarioMenus = await prisma.funcionarioMenu.findMany({
            where: { funcionarioId: funcionario_id },
        });

        const newMenus = menus.filter(
            (menu) => !existingFuncionarioMenus.some((fm) => fm.menuId === menu.id)
        );

        const createdFuncionarioMenus = await Promise.all(
            newMenus.map((menu) =>
                prisma.funcionarioMenu.create({
                    data: {
                        funcionarioId: funcionario_id,
                        menuId: menu.id,
                    },
                })
            )
        );

        res.status(200).json(createdFuncionarioMenus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar o menu do usuário." });
    }
}

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
    }
};

export const getMenusByEmpresaAndModulo = async (req: Request, res: Response) => {
    const { empresa_id, modulo_id } = req.params;

    if (!empresa_id || !modulo_id) {
        return res.status(400).json({ error: "Empresa ID and Modulo ID are required" });
    }

    try {
        const menus = await prisma.menus.findMany({
            where: {
                modulos_id: Number(modulo_id),
                empresa_id: Number(empresa_id),
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

        if (!menus.length) {
            return res.status(404).json({ error: "Menus not found for this company and module" });
        }

        res.status(200).json(menus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
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
    }
};