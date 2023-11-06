import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createItem = async (req: Request, res: Response) => {
    try {
      const {
        nome,
        relatorios,
        empresa_id,
        imagem1,
        imagem2,
        imagem3,
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
          nome: nome,
          modulos: {
            connect: { id: modulo_id },
          },
          empresa: {
            connect: { id: empresa_id },
          },
        },
      });

      const createdItems = await prisma.itens.create({
        data: {
          nome,
          menus: {
            connect: { id: createdMenu.id },
          },
          relatorios: {
            create: relatorios.map((relatorio:any) => ({
              nome: relatorio.nome,
              relatorio: relatorio.relatorio,
            })),
          },
        },
      });

      if (imagem1 || imagem2 || imagem3) {
        const data_criacao = new Date();
        await prisma.carrossel.create({
          data: {
            empresa_id: empresa_id,
            imagem_1: imagem1,
            imagem_2: imagem2,
            imagem_3: imagem3,
            data_criacao: data_criacao,
          },
        });
      }
  
      res.status(201).json({ menu: createdMenu, itens: createdItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Item creation failed" });
    } finally {
      await prisma.$disconnect();
    }
  };

// export const editItem = async (req: Request, res: Response) => {
//   try {
//     const {
//       id,
//       nome,
//       relatorios,
//       empresa_id,
//       imagem1,
//       imagem2,
//       imagem3,
//       modulo_id,
//     } = req.body;

//     // Check if the Modulo ID is valid
//     const modulo = await prisma.modulos.findUnique({
//       where: { id: modulo_id },
//     });

//     if (!modulo) {
//       return res.status(404).json({ error: 'Modulo not found' });
//     }

//     // Check if the Item ID is valid
//     const existingItem = await prisma.itens.findUnique({
//       where: { id },
//       include: {
//         menu: true,
//         menu: {
//           include: {
//             empresa: true,
//           },
//         },
//       },
//     });

//     if (!existingItem) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     // Atualiza os campos apenas se um novo valor for fornecido
//     const updatedFields: any = {
//       nome,
//       modulos: {
//         connect: { id: modulo_id },
//       },
//       empresa: {
//         connect: { id: empresa_id },
//       },
//     };

//     if (imagem1) {
//       updatedFields.imagem1 = imagem1;
//     }

//     if (imagem2) {
//       updatedFields.imagem2 = imagem2;
//     }

//     if (imagem3) {
//       updatedFields.imagem3 = imagem3;
//     }

//     const updatedMenu = await prisma.menus.update({
//       where: { id: existingItem.menu.id },
//       data: updatedFields,
//     });

//     const updatedRelatorios = await prisma.relatorios.updateMany({
//       where: { item_id: id },
//       data: {
//         nome: { set: relatorios.map((relatorio: any) => relatorio.nome) },
//         relatorio: { set: relatorios.map((relatorio: any) => relatorio.relatorio) },
//       },
//     });

//     res.status(200).json({ menu: updatedMenu, relatorios: updatedRelatorios });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Item update failed' });
//   } finally {
//     await prisma.$disconnect();
//   }
// };