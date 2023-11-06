// import { Request, Response } from 'express';
// import prisma from '../services/prisma';

// export const createItem = async (req: Request, res: Response) => {
//     try {
//         const { nome, menus_id, relatorios_id } = req.body;

//         const existingMenu = await prisma.menus.findUnique({
//             where: { id: menus_id },
//         });

//         if (!existingMenu) {
//             return res.status(404).json({ message: 'Menu não encontrado.' });
//         }

//         if (relatorios_id) {

//             const existingRelatorio = await prisma.relatorios.findUnique({
//                 where: { id: relatorios_id },
//             });

//             if (!existingRelatorio) {
//                 return res.status(404).json({ message: 'Relatório não encontrado.' });
//             }
//         }

//         const item = await prisma.itens.create({
//             data: {
//                 nome,
//                 menus: {
//                     connect: { id: menus_id }
//                 },
//                 relatorios_id: relatorios_id
//             },
//         });

//         res.status(201).json(item);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erro ao criar o item.' });
//     } finally {
//         await prisma.$disconnect();
//     }
// };

// export const getItem = async (req: Request, res: Response) => {
//     const itemId = parseInt(req.params.id);

//     const item = await prisma.itens.findUnique({
//         where: { id: itemId },
//     });

//     if (!item) {
//         return res.status(404).json({ message: 'Item não encontrado.' });
//     }

//     res.json(item);
// };

// export const updateItem = async (req: Request, res: Response) => {
//     const itemId = parseInt(req.params.id);
//     const { nome, menus_id } = req.body;

//     const existingItem = await prisma.itens.findUnique({
//         where: { id: itemId },
//     });

//     if (!existingItem) {
//         return res.status(404).json({ message: 'Item não encontrado.' });
//     }

//     try {
//         const existingMenu = await prisma.menus.findUnique({
//             where: { id: menus_id },
//         });

//         if (!existingMenu) {
//             return res.status(404).json({ message: 'Menu não encontrado.' });
//         }

//         const updatedItem = await prisma.itens.update({
//             where: { id: itemId },
//             data: {
//                 nome,
//                 menus_id,
//             },
//         });

//         res.json(updatedItem);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erro ao atualizar o item.' });
//     } finally {
//         await prisma.$disconnect();
//     }
// };

// export const deleteItem = async (req: Request, res: Response) => {
//     const itemId = parseInt(req.params.id);

//     const existingItem = await prisma.itens.findUnique({
//         where: { id: itemId },
//     });

//     if (!existingItem) {
//         return res.status(404).json({ message: 'Item não encontrado.' });
//     }

//     try {
//         await prisma.itens.delete({
//             where: { id: itemId },
//         });

//         res.status(204).send();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erro ao excluir o item.' });
//     } finally {
//         await prisma.$disconnect();
//     }
// };

// export const getAllItens = async (req: Request, res: Response) => {
//     try {
//         const itens = await prisma.itens.findMany();
//         res.json(itens);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erro ao buscar itens.' });
//     } finally {
//         await prisma.$disconnect();
//     }
// };
