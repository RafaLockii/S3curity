import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
const prisma = new PrismaClient();
import { Request, Response } from 'express';

const chaveSecreta = randomBytes(256).toString('hex');

export const autenticarToken = (req:any, res:any, next:any) => {
    try{
        const token = req.headers['authorization'];

        if (!token) {
            console.log('Token não fornecido.');
            return res.status(401).json({ mensagem: 'Token não fornecido.' });
        }

        jwt.verify(token, chaveSecreta, (erro:any, dadosDecodificados:any) => {
            if (erro) {
                console.log('Token inválido:', erro);
                return res.status(403).json({ mensagem: 'Token inválido.' });
            }

            //console.log('Dados do usuário decodificados:', dadosDecodificados);

            req.usuario = dadosDecodificados;
            next();
        });
    } catch (error) {
        return res.status(404).json({ error: 'Ocorreu um erro ao verificar Token.' });
    }
};

export const login = async (req: Request, res: Response) => {
    
    try {
        const { email, senha } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email, senha: senha },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const Admin = await prisma.funcionario.findUnique({
            where: {usuario_id: user.id}
        })

        const isCargo = await prisma.cargos.findFirstOrThrow({
            where: {
                cargo_id: Admin?.cargo_id ?? { equals: 0 }
            }
        })
        const token = jwt.sign({ email }, chaveSecreta);
        // console.log('Token gerado:', token);
        return res.status(200).json({
            token: token,
            id: user.id,
            email: user.email,
            nome: user.nome,
            cargo: isCargo.cargo_id,
            isAdmin: Admin?.acesso_admin,
        });
    } catch (error) {
        return res.status(404).json({ error: 'Ocorreu um erro ao atualizar o usuário.' });
    }
};

export const adminAuthMiddleware = async (req: any, res: any, next: any) => {
    try {
        const User = req.usuario;

        const Verified = await prisma.user.findUnique({
            where: { email: User.email }
        });

        const ADMIN = await prisma.funcionario.findUnique({
            where: { usuario_id: Verified?.id }
        });

        if (ADMIN && ADMIN.acesso_admin) {
        return next();
        }

        const error = {
            error: {
                message: 'Não autorizado.',
                stack: 'Não pode acessar a rota devido à falta de permissões de administrador.',
                status: 401,
            },
        };
        throw error;
    } catch (error) {
        res.status(401).send({ error: 'Ocorreu erro ao verificar permissão ADMIN'});
    }
};