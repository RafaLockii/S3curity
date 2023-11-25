import { Request, Response } from "express";
import prisma from "../services/prisma";

export const getMenus = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      },
      include: {
        funcionario: {
          include: {
            menus: {
              include: {
                modulos: true
              }
            }
          }
        }
      }
    });

    const formattedMenus =
      user?.funcionario?.menus.map((menu) => ({
        id: menu.id,
        nome: menu.nome,
        modulo: menu.modulos.nome
      })) || [];

    res.status(200).json({ menus: formattedMenus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get menus" });
  }
};

export const getItens = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      },
      include: {
        funcionario: {
          include: {
            menus: {
              include: {
                itens: {
                  include: {
                    relatorios: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const itens =
      user?.funcionario?.menus.flatMap((menu) =>
        menu.itens.map((item) => ({
          id: item.id,
          nome: item.nome,
          menus_id: menu.id
        }))
      ) || [];

    res.status(200).json({ itens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get itens" });
  }
};

export const getRelatorio = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      },
      include: {
        funcionario: {
          include: {
            menus: {
              include: {
                itens: {
                  include: {
                    relatorios: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const relatorios =
      user?.funcionario?.menus.flatMap((menu) =>
        menu.itens.flatMap((item) =>
          item.relatorios.map((relatorio) => ({
            id: relatorio.id,
            nome: relatorio.nome,
            relatorio: relatorio.relatorio,
            itens_id: item.id
          }))
        )
      ) || [];

    res.status(200).json({ relatorios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get relatorios" });
  }
};

export const getModulosByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      },
      include: {
        funcionario: {
          include: {
            modulos: true
          }
        }
      }
    });

    const userModulos = user?.funcionario?.modulos || [];

    res.status(200).json({ modulos: userModulos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get modulos for the user" });
  }
};

export const getAllSeparatedData = async (req: Request, res: Response) => {
  try {
    const modulos = await prisma.modulos.findMany();
    const menus = await prisma.menus.findMany();
    const itens = await prisma.itens.findMany();
    const relatorios = await prisma.relatorios.findMany();

    res.status(200).json({
      modulos: modulos.map((modulo) => ({
        id: modulo.id,
        nome: modulo.nome
      })),
      menus: menus.map((menu) => ({
        id: menu.id,
        nome: menu.nome,
        modulos_id: menu.modulos_id
      })),
      itens: itens.map((item) => ({
        id: item.id,
        nome: item.nome,
        menus_id: item.menus_id
      })),
      relatorios: relatorios.map((relatorio) => ({
        id: relatorio.id,
        nome: relatorio.nome,
        relatorio: relatorio.relatorio,
        itens_id: relatorio.itens_id
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get separated data" });
  }
};

export const getSeparatedDataByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: {
        usuario_id: parseInt(userId)
      }
    });

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionario not found" });
    }

    const modulos = await prisma.modulos.findMany({
      where: {
        usuarios: {
          some: {
            usuario_id: funcionario.usuario_id
          }
        }
      }
    });

    const menus = await prisma.menus.findMany({
      where: {
        usuarios: {
          some: {
            usuario_id: funcionario.usuario_id
          }
        }
      }
    });

    const itens = await prisma.itens.findMany({
      where: {
        usuarios: {
          some: {
            usuario_id: funcionario.usuario_id
          }
        }
      }
    });

    const relatorios = await prisma.relatorios.findMany({
      where: {
        usuarios: {
          some: {
            usuario_id: funcionario.usuario_id
          }
        }
      }
    });

    res.status(200).json({
      modulos: modulos.map((modulo) => ({
        id: modulo.id,
        nome: modulo.nome
      })),
      menus: menus.map((menu) => ({
        id: menu.id,
        nome: menu.nome,
        modulos_id: menu.modulos_id
      })),
      itens: itens.map((item) => ({
        id: item.id,
        nome: item.nome,
        menus_id: item.menus_id
      })),
      relatorios: relatorios.map((relatorio) => ({
        id: relatorio.id,
        nome: relatorio.nome,
        relatorio: relatorio.relatorio,
        itens_id: relatorio.itens_id
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get separated data by user ID" });
  }
};


