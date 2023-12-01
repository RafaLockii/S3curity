import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const chaveSecreta = randomBytes(256).toString("hex");

export const autenticarToken = (req: any, res: any, next: any) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      console.log("Token não fornecido.");
      return res.status(401).json({ mensagem: "Token não fornecido." });
    }

    jwt.verify(token, chaveSecreta, (erro: any, dadosDecodificados: any) => {
      if (erro) {
        console.log("Token inválido:", erro);
        return res.status(403).json({ mensagem: "Token inválido." });
      }

      //console.log('Dados do usuário decodificados:', dadosDecodificados);

      req.usuario = dadosDecodificados;
      next();
    });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Ocorreu um erro ao verificar Token." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const Admin = await prisma.funcionario.findUnique({
      where: { usuario_id: user.id }
    });

    if (!Admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const token = jwt.sign({ email }, chaveSecreta);
    // console.log('Token gerado:', token);
    return res.status(200).json({
      token: token,
      id: user.id,
      email: user.email,
      nome: user.nome,
      isAdmin: Admin.acesso_admin,
      fotoPerfil: Admin.imagem_perfil_id
    });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Ocorreu um erro ao atualizar o usuário." });
  }
};

export const funcionarioAdminAuthMiddleware = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const User = req.usuario;

    const Verified = await prisma.user.findUnique({
      where: { email: User.email, verified: true }
    });

    if (!Verified) {
      return res.status(404).json({ error: "User not found" });
    }

    const ADMIN = await prisma.funcionario.findUnique({
      where: { usuario_id: Verified.id, acesso_admin: true }
    });

    if (ADMIN && ADMIN.acesso_admin) {
      return next();
    }

    const error = {
      error: {
        message: "Não autorizado.",
        stack:
          "Não pode acessar a rota devido à falta de permissões de administrador.",
        status: 401
      }
    };
    throw error;
  } catch (error) {
    res
      .status(401)
      .send({ error: "Ocorreu erro ao verificar permissão ADMIN" });
  }
};

export const adminAuthMiddlewareS3curity = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const User = req.usuario;

    const UserExisting = await prisma.user.findUnique({
      where: { email: User.email }
    });

    if (!UserExisting) {
      return res.status(404).json({ error: "User not found" });
    }

    const ExistingFuncionario = await prisma.funcionario.findUnique({
      where: { usuario_id: UserExisting.id }
    });

    if (!ExistingFuncionario) {
      return res.status(404).json({ error: "Funcionario S3curity not found" });
    }

    if (ExistingFuncionario.empresa_id){
      const BuscaEmpresa = await prisma.empresa.findUnique({
        where: { id: ExistingFuncionario.empresa_id, nome: "sec3rity" }
      });

      if (!BuscaEmpresa) {
        return res.status(404).json({ error: "Empresa S3curity not found" });
      }

      if (ExistingFuncionario && BuscaEmpresa) {
        return next();
      }
    }

    const error = {
      error: {
        message: "Não autorizado.",
        stack:
          "Não pode acessar a rota devido à falta de permissões de administrador s3curity.",
        status: 401
      }
    };
    throw error;
  } catch (error) {
    res
      .status(401)
      .send({ error: "Ocorreu erro ao verificar permissão ADMIN" });
  }
};

export const adminEmpresaOrS3curity = async (req: any, res: any, next: any) => {
  const User = req.usuario;
  try {
    const UserExisting = await prisma.user.findUnique({
      where: { email: User.email }
    });

    if (!UserExisting) {
      return res.status(404).json({ error: "User not found" });
    }

    const ExistingFuncionario = await prisma.funcionario.findUnique({
      where: { usuario_id: UserExisting.id, acesso_admin: true }
    });

    if (!ExistingFuncionario) {
      return res.status(404).json({ error: "Funcionario not found" });
    }

    if (ExistingFuncionario.empresa_id){
      const BuscaEmpresa = await prisma.empresa.findUnique({
        where: { id: ExistingFuncionario.empresa_id }
      });

      if (!BuscaEmpresa) {
        return res.status(404).json({ error: "Empresa not found" });
      }

      if (ExistingFuncionario && BuscaEmpresa) {
        return next();
      }
    }

    const error = {
      error: {
        message: "Não autorizado.",
        stack:
          "Não pode acessar a rota devido à falta de permissões de administrador s3curity.",
        status: 401
      }
    };
    throw error;
  } catch (error) {
    res
      .status(401)
      .send({ error: "Ocorreu erro ao verificar permissão ADMIN" });
  }
};
