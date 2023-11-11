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
    cargo_id,
    empresa_id,
    imagem_perfil_url,
    menus_ids
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

    const hashedPassword = await bcrypt.hash(senha, 10);

    const secret = speakeasy.generateSecret({ length: 6 });
    const code = secret.base32;

    const currentDatetime = new Date();

    const user = await prisma.user.create({
        data: {
            nome,
            senha: hashedPassword,
            email,
            telefone,
            token: code,
            funcionario: {
            create: {
                ativo: true,
                cadastro_alterado: currentDatetime,
                usuario_cad_alt: usuario_criacao,
                modulo_default,
                acesso_admin,
                empresa: { connect: { id: empresa_id } },
                cargo: { connect: { cargo_id: cargo_id } }
            }
            }
        },
        include: {
            funcionario: true
        }
        });

        if (imagem_perfil_url) {
            const createdImagem = await prisma.imagem.create({
                data: {
                url: imagem_perfil_url,
                funcionario: {
                    connect: { id: user.funcionario?.id }
                }
                }
            });

            if (createdImagem) {
                const updatedFuncionario = await prisma.funcionario.update({
                where: { id: user.funcionario?.id },
                data: { imagem_perfil_id: createdImagem.id }
                });
            }
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { id: user.funcionario?.id },
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
            where: { funcionarioId: funcionario.id },
        });

        const newMenus = menus.filter(
            (menu: any) => !existingFuncionarioMenus.some((fm: any) => fm.menuId === menu.id)
        );

        const createdFuncionarioMenus = await Promise.all(
            newMenus.map((menu: any) =>
                prisma.funcionarioMenu.create({
                    data: {
                        funcionarioId: funcionario.id,
                        menuId: menu.id,
                    },
                })
            )
        );

        if (user.token) {
        transporter.sendMail(
            {
            from: "jocyannovittor@hotmail.com",
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
    try {
        const userId = parseInt(req.params.id);
        const {
        nome,
        senha,
        email,
        telefone,
        modulo_default,
        acesso_admin,
        ativo,
        cargo_id,
        empresa_id,
        imagem_perfil_url,
        menus_ids
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
                email: email,
            }
        });

        if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
            return res.status(400).json({ message: "Email já está em uso." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                nome,
                senha: hashedPassword,
                email,
                telefone
            }
        });

        if (empresa_id && cargo_id) {
        const existingEmpresa = await prisma.empresa.findUnique({
            where: {
            id: empresa_id
            }
        });

        if (!existingEmpresa) {
            return res.status(404).json({ message: "Empresa não encontrado." });
        }

        const updatedFuncionario = await prisma.funcionario.update({
            where: {
                usuario_id: userId
            },
            data: {
            modulo_default,
            ativo: ativo,
            acesso_admin,
            empresa: { connect: { id: empresa_id } },
            cargo: { connect: { cargo_id: cargo_id } },
            menus: {
                set: menus_ids.map((menuId: number) => ({ id: menuId })),
            },
            }
        });

            const ImagemExist = await prisma.imagem.findUnique({
                where: {funcionario_id: updatedFuncionario.id}
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
        console.error(error);
        res.status(500).json({ message: "Erro ao editar o usuário." });
    }
};

export const getUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            funcionario: true
        }
    });

    if (!user || !user.funcionario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const funcionario = await prisma.funcionario.findUnique({
        where: {
            id: user.funcionario.id
        },
        include: {
            imagem: true,
            cargo: true,
            empresa: {
                include: {
                    menus: {
                        include: {
                            itens: {
                                include: {
                                    relatorios: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const formattedUser = {
      ...user,
      funcionario: {
        ...funcionario,
        cadastro_alterado:
          funcionario?.cadastro_alterado?.toLocaleString() || null,
        empresa: {
          ...funcionario?.empresa,
          data_criacao:
            funcionario?.empresa?.data_criacao?.toLocaleString() || null
        }
      }
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar as informações do usuário." });
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
              cargo: true,
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
              cargo: true,
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
        await prisma.funcionarioMenu.deleteMany({
            where: { funcionarioId: Number(id) },
        });

        const user = await prisma.funcionario.delete({
            where: { id: Number(id) },
        });

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao excluir o usuário." });
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
    
    const { userId, menu_id } = req.body;

    try {

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

        await prisma.funcionarioMenu.deleteMany({
            where: { 
                funcionarioId: Number(existingUser.funcionario?.id),
                menuId: Number(menu_id)
            },
        });

        res.status(200).json({ message: "Relacionamento de menu de usuário excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao excluir o relacionamento de menu do usuário." });
    }
};

// exibir menus do usuario e da empresa
export const getUserAndCompanyMenus = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { usuario_id: user.id },
            include: {
                menus: {
                    include: {
                        menu: {
                            include: {
                                itens: {
                                    include: {
                                        relatorios: true,
                                    },
                                },
                            },
                        },
                    },
                },
                empresa: true,
            },
        });

        if (!funcionario) {
            return res.status(404).json({ error: "Funcionario not found" });
        }

        const menus = await prisma.menus.findMany({
            where: {
                id: {
                    in: funcionario.menus.map((fm) => fm.menu.id),
                },
            },
            include: {
                itens: {
                    include: {
                        relatorios: true,
                    },
                },
            },
        });

        const combinedMenus = [
            ...menus,
        ];

        res.status(200).json({ ...user, funcionario: { ...funcionario, menus: combinedMenus } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar o usuário e os menus da empresa." });
    }
};