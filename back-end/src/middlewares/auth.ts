import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
const prisma = new PrismaClient();
import { Request, Response } from 'express';

const chaveSecreta = randomBytes(256).toString('hex');

export const autenticarToken = (req:any, res:any, next:any) => {
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
};

export const login = async (req: Request, res: Response) => {
    const { nome, senha } = req.body;

    const user = await prisma.user.findFirst({
        where: { nome: nome, senha: senha },
    });

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    try {
        const token = jwt.sign({ nome }, chaveSecreta);
        console.log('Token gerado:', token);
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(404).json({ error: 'Ocorreu um erro ao atualizar o usuário.' });
    }
};
