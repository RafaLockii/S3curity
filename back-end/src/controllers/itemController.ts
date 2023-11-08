import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const createItem = async (req: Request, res: Response) => {
    try {
      const {
        nomeMenu,
        nomeItem,
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
          nome: nomeMenu,
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
          nome: nomeItem,
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
            menus_id: createdMenu.id,
            empresa_id: empresa_id,
            imagem_1: imagem1 || null,
            imagem_2: imagem2 || null,
            imagem_3: imagem3 || null,
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
//       menu_id, // ID do Menu que você deseja atualizar
//       nome,
//       nomeItem,
//       relatorios,
//       imagem1,
//       imagem2,
//       imagem3,
//     } = req.body;

//     const updatedMenu = await prisma.menus.update({
//       where: { id: menu_id },
//       data: {
//         nome,
//       },
//     });

//     // Atualize os Itens relacionados
//     await prisma.itens.updateMany({
//       where: { menus_id: menu_id },
//       data: {
//         nome: nomeItem,
//       },
//     });

//     // Crie ou atualize os relatórios relacionados
//     for (const relatorioData of relatorios) {
//       const { id: relatorioId, nome: relatorioNome, relatorio: relatorioTexto } = relatorioData;
//       if (relatorioId) {
//         // Atualize o relatório existente
//         await prisma.relatorios.update({
//           where: { id: relatorioId },
//           data: {
//             nome: relatorioNome,
//             relatorio: relatorioTexto,
//           },
//         });
//       } else {
//         // Crie um novo relatório
//         await prisma.relatorios.create({
//           data: {
//             nome: relatorioNome,
//             relatorio: relatorioTexto,
//             itens: {
//               connect: { menu_id },
//             },
//           },
//         });
//       }
//     }

//     // Atualize o Carrossel (se fornecido)
//     if (imagem1 || imagem2 || imagem3) {
      
//       const data_criacao = new Date();

//       await prisma.carrossel.upsert({
//         where: { menus_id: id }, // Usando menus_id como a chave
//         update: {
//           imagem_1: imagem1 || null,
//           imagem_2: imagem2 || null,
//           imagem_3: imagem3 || null,
//           data_criacao,
//         },
//         create: {
//           menus: {
//             connect: { id },
//           },
//           empresa: {
//             connect: { id: updatedMenu.empresa_id },
//           },
//           imagem_1: imagem1,
//           imagem_2: imagem2,
//           imagem_3: imagem3,
//           data_criacao,
//         },
//       });
//     }

//     res.status(200).json({ menu: updatedMenu });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Falha na edição do Item' });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

export const filterByEmpresaAndModulo = async (req: Request, res: Response) => {
  try {
    const { empresa_id, modulo_id } = req.params;

    if (!empresa_id || !modulo_id) {
      return res.status(400).json({ error: 'empresa_id e modulo_id são obrigatórios' });
    }

    const resources = await prisma.menus.findMany({
      where: {
        empresa_id: Number(empresa_id),
        modulos_id: Number(modulo_id),
      },
      include: {
        itens: {
          include: {
            relatorios: true,
          },
        },
        carrosseis: true,
      },
    });

    res.status(200).json({ resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha na consulta' });
  } finally {
    await prisma.$disconnect();
  }
};