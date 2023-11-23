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

// export const createMenuUser = async (req: Request, res: Response) => {
//   const { usuario_id, menus_ids, itens_ids, relatorios_ids } = req.body;

//   try {
//     const usuario = await prisma.funcionario.findUnique({
//       where: { usuario_id: usuario_id }
//     });

//     if (!usuario) {
//       return res.status(404).json({ error: "Usuario not found" });
//     }

//     const menus = await prisma.menus.findMany({
//       where: { id: { in: menus_ids } },
//     });

//     const itens = await prisma.itens.findMany({
//       where: { id: { in: itens_ids } },
//     });

//     const relatorios = await prisma.relatorios.findMany({
//       where: { id: { in: relatorios_ids } },
//     });

//     if (menus.length !== menus_ids.length || itens.length !== itens_ids.length || relatorios.length !== relatorios_ids.length) {
//       return res.status(404).json({ error: "One or more menus, items or reports not found" });
//     }

//     // await prisma.funcionario.create({
//     //   where: { usuario_id: usuario_id },
//     //   data: {

//     //     menus: {
//     //       connect: menus_ids.map((id: any) => ({ id }))
//     //     },
//     //     itens: {
//     //       connect: itens_ids.map((id: any) => ({ id }))
//     //     },
//     //     relatorios: {
//     //       connect: relatorios_ids.map((id: any) => ({ id }))
//     //     }
//     //   }
//     // });

//     // await prisma.funcionario.update({
//     //   where: { usuario_id: usuario_id },
//     //   data: {
//     //     menus: {
//     //       connect: menus_ids.map((id: any) => ({ id }))
//     //     },
//     //     itens: {
//     //       connect: itens_ids.map((id: any) => ({ id }))
//     //     },
//     //     relatorios: {
//     //       connect: relatorios_ids.map((id: any) => ({ id }))
//     //     }
//     //   }
//     // });

//     return res.status(200).json({ message: "Menus, items and reports successfully associated with the user" });
//   } catch (error) {
//     if (error instanceof Error) {
//         return res.status(500).json({ error: error.message });
//     } else {
//         return res.status(500).json({ error: "An unknown error occurred" });
//     }
// }}

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

// export const getMenusByEmpresaAndModulo = async (req: Request, res: Response) => {
//     const { empresa_id, modulo_id } = req.params;

//     if (!empresa_id || !modulo_id) {
//         return res.status(400).json({ error: "Empresa ID and Modulo ID are required" });
//     }

//     try {
//         const menus = await prisma.menus.findMany({
//             where: {
//                 modulos_id: Number(modulo_id),
//                 empresa_id: Number(empresa_id),
//             },
//             include: {
//                 empresa: true,
//                 modulos: true,
//                 itens: {
//                     include: {
//                         relatorios: true,
//                     },
//                 },
//             },
//         });

//         if (!menus.length) {
//             return res.status(404).json({ error: "Menus not found for this company and module" });
//         }

//         res.status(200).json(menus);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to get menus" });
//     }
// };

export const getAllMenus = async (req: Request, res: Response) => {

    try {
        const menus = await prisma.menus.findMany({
            include: {
                modulos: true,
                itens: { include: { relatorios: true } },
            },
        });

        const formattedMenus = menus.map(menu => ({
            id: menu.id,
            nome: menu.nome,
            modulo: menu.modulos.nome,
            itens: menu.itens
        }));

        res.status(200).json({ menus: formattedMenus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
};

export const getMenus = async (req: Request, res: Response) => {

    try {
        const menus = await prisma.menus.findMany({
            include: {
                modulos: true,
            },
        });

        const formattedMenus = menus.map(menu => ({
            id: menu.id,
            nome: menu.nome,
            modulo: menu.modulos.nome,
        }));

        res.status(200).json({ menus: formattedMenus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
};
export const getItens = async (req: Request, res: Response) => {

    try {
        const menus = await prisma.menus.findMany({
            include: {
                modulos: true,
                itens: { include: { relatorios: true } },
            },
        });
 
        const itens = menus.flatMap(menu => {
            return menu.itens.map(item => {
                return {
                   id: item.id,
                   nome: item.nome,
                   menus_id: menu.id,
                }
            })
        });
 
        res.status(200).json({ itens: itens });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
 };
export const getRelatorio = async (req: Request, res: Response) => {

    try {
        const menus = await prisma.menus.findMany({
            include: {
                modulos: true,
                itens: { include: { relatorios: true } },
            },
        });
 
        const itens = menus.flatMap(menu => {
            return menu.itens.map(item => {
                return {
                   id: item.id,
                   nome: item.nome,
                   menus_id: menu.id,
                   relatorios: item.relatorios
                }
            })
        });

        const relatorios = itens.flatMap(item => {
            return item.relatorios.map(relatorio => {
                return {
                     id: relatorio.id,
                        nome: relatorio.nome,
                        relatorio: relatorio.relatorio,
                        itens_id: item.id,
                }
            })
        });
 
        res.status(200).json({ relatorios: relatorios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
};

export const getAllModulos = async (req: Request, res: Response) => {
    try {
      const modulos = await prisma.modulos.findMany();
  
      res.json({ modulos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Falha ao buscar módulos" });
    }
  };