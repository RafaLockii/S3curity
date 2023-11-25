import { Request, Response } from "express";
import prisma from "../services/prisma";
import { transporter } from "../services/nodemailer";
import bcrypt from "bcrypt";
const speakeasy = require("speakeasy");

export const createUser = async (req: Request, res: Response) => {
  const {
    nome,
    senha,
    email,
    telefone,
    usuario_criacao,
    modulo_default,
    acesso_admin,
    empresa_id,
    imagem_perfil_url,
    modulos_id,
    menus_ids,
    itens_ids,
    relatorios_ids
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (existingUser) {
        return res.status(400).json({ message: "O e-mail já está em uso." });
    }

    const existingEmpresa = await prisma.empresa.findUnique({
        where: {
            id: empresa_id
        }
    });

    if (!existingEmpresa) {
        return res
            .status(400)
            .json({ message: "A empresa especificada não foi encontrada." });
    }

    const modulos = await prisma.modulos.findMany({
        where: { id: { in: modulos_id } }
    });

    const menus = await prisma.menus.findMany({
      where: { id: { in: menus_ids } }
    });

    const itens = await prisma.itens.findMany({
      where: { id: { in: itens_ids } }
    });

    const relatorios = await prisma.relatorios.findMany({
      where: { id: { in: relatorios_ids } }
    });

    if (
      modulos.length !== modulos_id.length ||
      menus.length !== menus_ids.length ||
      itens.length !== itens_ids.length ||
      relatorios.length !== relatorios_ids.length
    ) {
      return res
        .status(404)
        .json({ error: "One or more modulos, menus, items or reports not found" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const secret = speakeasy.generateSecret({ length: 6 });
    const code = secret.base32;

    const currentDatetime = new Date();

    const user = await prisma.$transaction([
      prisma.user.create({
        data: {
          nome,
          senha: hashedPassword,
          email,
          telefone,
          token: code,
          funcionario: {
            create: {
              //ativo: true,
              cadastro_alterado: currentDatetime,
              usuario_cad_alt: usuario_criacao,
              modulo_default,
              acesso_admin,
              empresa: { connect: { id: empresa_id } },
              modulos: {
                connect: modulos_id.map((id: any) => ({ id }))
              },
              menus: {
                connect: menus_ids.map((id: any) => ({ id }))
              },
              itens: {
                connect: itens_ids.map((id: any) => ({ id }))
              },
              relatorios: {
                connect: relatorios_ids.map((id: any) => ({ id }))
              }
            }
          }
        },
        include: {
          funcionario: true
        }
      })
    ]);

        if (user[0].funcionario) {
            const createdImagem = await prisma.imagem.create({
                data: {
                    url: imagem_perfil_url,
                    funcionario: {
                        connect: { id: user[0].funcionario.id }
                    }
                }
            });

            if (createdImagem) {
                const updatedFuncionario = await prisma.funcionario.update({
                    where: { id: user[0].funcionario.id },
                    data: { imagem_perfil_id: createdImagem.id }
                });
            }
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { id: user[0].funcionario?.id },
        });

        if (!funcionario) {
            return res.status(404).json({ error: "Funcionario not found" });
        }

        if (user[0].token) {
        transporter.sendMail(
            {
            to: email,
            subject: "Código de Ativação de Usuário",
            text: `Seu Token de Ativação é: ${code}`
            },
            (error: Error, info: any) => {
            if (error) {
                console.error(error);
            } else {
                console.log(
                "Chave secreta 2FA enviada com sucesso: " + info.response
                );
            }
            }
        );
        }

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar o usuário." });
    }
};

export const editUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

    try {
      const {
        nome,
        senha,
        email,
        telefone,
        modulo_default,
        acesso_admin,
        empresa_id,
        imagem_perfil_url,
        modulos_id,
        menus_ids,
        itens_ids,
        relatorios_ids
      } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          funcionario: true
        }
      });

      if (!existingUser) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const existingUserWithEmail = await prisma.user.findUnique({
        where: {
          email: email
        }
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return res.status(400).json({ message: "Email já está em uso." });
      }

      let updateData: any = {};

      if (nome) updateData.nome = nome;
      if (senha) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        updateData.senha = hashedPassword;
      }
      if (email) updateData.email = email;
      if (telefone) updateData.telefone = telefone;

      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: updateData
      });

      if (empresa_id) {
        const existingEmpresa = await prisma.empresa.findUnique({
          where: {
            id: empresa_id
          }
        });

        if (!existingEmpresa) {
          return res.status(404).json({ message: "Empresa não encontrado." });
        }

        const updatedFuncionario = await prisma.user.update({
          where: { id: Number(userId) },
          data: {
            nome,
            email,
            telefone,
            funcionario: {
              update: {
                modulo_default,
                acesso_admin,
                empresa: { connect: { id: empresa_id } },
                modulos: {
                  set: modulos_id.map((id: any) => ({ id }))
                },
                menus: {
                  set: menus_ids.map((id: any) => ({ id }))
                },
                itens: {
                  set: itens_ids.map((id: any) => ({ id }))
                },
                relatorios: {
                  set: relatorios_ids.map((id: any) => ({ id }))
                }
              }
            }
          },
          include: {
            funcionario: true
          }
        });

        const ImagemExist = await prisma.imagem.findUnique({
          where: { funcionario_id: updatedFuncionario.id }
        });

        if (ImagemExist) {
          const updatedImagem = await prisma.imagem.update({
            where: {
              funcionario_id: updatedFuncionario.id
            },
            data: {
              url: imagem_perfil_url
            }
          });
        } else if (existingUser.funcionario) {
          const createdImagem = await prisma.imagem.create({
            data: {
              url: imagem_perfil_url,
              funcionario_id: updatedFuncionario.id
            }
          });

          const updatedImagem = await prisma.funcionario.update({
            where: {
              id: updatedFuncionario.id
            },
            data: {
              imagem_perfil_id: createdImagem.id
            }
          });
        }
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "An unknown error occurred" });
      }
    }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.funcionario.findUnique({
      where: { usuario_id: Number(id) },
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
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario not found" });
    }

    const structuredData = {
      id: user.id,
      modulo_default: user.modulo_default,
      acesso_admin: user.acesso_admin,
      ativo: user.ativo,
      cadastro_alterado: user.cadastro_alterado,
      usuario_cad_alt: user.usuario_cad_alt,
      usuario_id: user.usuario_id,
      empresa_id: user.empresa_id,
      imagem_perfil_id: user.imagem_perfil_id,
      menus: user.menus.map((menu) => ({
        id: menu.id,
        nome: menu.nome,
        modulos_id: menu.modulos_id,
        itens: menu.itens.map((item) => ({
          id: item.id,
          nome: item.nome,
          menus_id: item.menus_id,
          relatorios: item.relatorios.map((relatorio) => ({
            id: relatorio.id,
            nome: relatorio.nome,
            relatorio: relatorio.relatorio,
            itens_id: relatorio.itens_id
          }))
        }))
      }))
    };

    res.json(structuredData);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const listUsers = async (req: Request, res: Response) => {
  const empresaNome = req.params.empresa;

  try {
    if (empresaNome === "sec3rity") {
      const users = await prisma.user.findMany({
        include: {
          funcionario: {
            include: {
              imagem: true,
              empresa: true,
              modulos: true,
            }
          }
        }
      });

      const formattedUsers = users.map((user) => ({
        ...user,
        funcionario: {
          ...user.funcionario,
          cadastro_alterado:
            user.funcionario?.cadastro_alterado?.toLocaleString() || null,
          empresa: {
            ...user.funcionario?.empresa,
            data_criacao:
              user.funcionario?.empresa?.data_criacao?.toLocaleString() || null
          }
        }
      }));

      res.status(200).json(formattedUsers);
    } else {
      const empresa = await prisma.empresa.findUnique({
        where: {
          nome: empresaNome
        }
      });

      if (!empresa) {
        return res.status(404).json({ message: "Empresa não encontrada." });
      }

      const users = await prisma.user.findMany({
        where: {
          funcionario: {
            empresa_id: empresa.id
          }
        },
        include: {
          funcionario: {
            include: {
              imagem: true,
              empresa: true
            }
          }
        }
      });

      const formattedUsers = users.map((user) => ({
        ...user,
        funcionario: {
          ...user.funcionario,
          cadastro_alterado:
            user.funcionario?.cadastro_alterado?.toLocaleString() || null,
          empresa: {
            ...user.funcionario?.empresa,
            data_criacao:
              user.funcionario?.empresa?.data_criacao?.toLocaleString() || null
          }
        }
      }));

      res.status(200).json(formattedUsers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar os usuários." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        funcionario: {
          include: {
            imagem: true,
            modulos: true,
            menus: true,
            itens: true,
            relatorios: true
          }
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.json(deletedUser);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao deletar" });
  }
};

export const ativarUser = async (req: Request, res: Response) => {
  const { email, token } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (user.verified == true) {
      return res.status(404).json({ message: "Usuário já se encontra ativo." });
    }

    const userVerified = await prisma.user.findFirst({
      where: {
        email: email,
        token: token,
        verified: false
      }
    });

    if (!userVerified) {
      return res.status(400).json({ message: "Falha ao verificar usuário" });
    }

    if (userVerified) {
      await prisma.user.update({
        where: {
          email: email
        },
        data: {
          verified: true
        }
      });

      return res.status(200).json({ message: "Usuário ativado com sucesso." });
    } else {
      return res.status(401).json({ message: "Código Token inválido." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao verificar o 2FA e atualizar a senha." });
  }
};

export const deleteMenuUser = async (req: Request, res: Response) => {
  const { userId, menuId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        funcionario: {
          where: {
            menus: {
              some: {
                id: menuId
              }
            }
          },
          include: {
            itens: {
              where: {
                menus_id: menuId
              },
              include: {
                relatorios: true
              }
            }
          }
        }
      }
    });

    if (!existingUser || !existingUser.funcionario) {
      return res
        .status(404)
        .json({ message: "Usuário ou funcionário não encontrado." });
    }

    const funcionarioId = existingUser.funcionario.id;

    await prisma.funcionario.update({
      where: {
        id: funcionarioId
      },
      data: {
        menus: {
          disconnect: {
            id: menuId
          }
        },
        itens: {
          disconnect: existingUser.funcionario.itens.map((item: any) => ({
            id: item.id
          }))
        },
        relatorios: {
          deleteMany: {
            id: {
              in: existingUser.funcionario.itens.flatMap((item: any) =>
                item.relatorios.map((relatorio: any) => relatorio.id)
              )
            }
          }
        }
      }
    });

    res.status(200).json({
      message: "Relacionamento de menu de usuário excluído com sucesso."
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteItemWithReportsForUser = async (
  req: Request,
  res: Response
) => {
  const { userId, itemId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      },
      include: {
        funcionario: {
          where: {
            itens: {
              some: {
                id: Number(itemId)
              }
            }
          }
        }
      }
    });

    if (!existingUser || !existingUser.funcionario) {
      return res
        .status(404)
        .json({ message: "Usuário ou item não encontrado." });
    }

    // Remove o item específico associado ao usuário
    await prisma.itens.delete({
      where: {
        id: Number(itemId)
      }
    });

    // Busca os relatórios associados ao item para esse usuário e exclui-os
    const relatoriosDoItem = await prisma.relatorios.findMany({
      where: {
        itens_id: Number(itemId)
      }
    });

    const relatorioIds = relatoriosDoItem.map((relatorio) => relatorio.id);
    await prisma.relatorios.deleteMany({
      where: {
        id: {
          in: relatorioIds
        }
      }
    });

    res.status(200).json({
      message:
        "Item e seus relatórios associados foram removidos com sucesso para o usuário especificado."
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteReportForItem = async (req: Request, res: Response) => {
  const { userId, itemId, reportId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      }
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const item = await prisma.itens.findFirst({
      where: {
        id: Number(itemId),
        relatorios: {
          some: {
            id: Number(reportId)
          }
        }
      }
    });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item não encontrado para este usuário." });
    }

    const report = await prisma.relatorios.findFirst({
      where: {
        id: Number(reportId),
        itens_id: Number(itemId)
      }
    });

    if (!report) {
      return res
        .status(404)
        .json({ message: "Relatório não encontrado para este item." });
    }

    await prisma.relatorios.delete({
      where: {
        id: Number(reportId)
      }
    });

    return res
      .status(200)
      .json({
        message: "Relatório removido com sucesso para o item especificado."
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Erro ao remover o relatório para o item especificado."
      });
  }
};