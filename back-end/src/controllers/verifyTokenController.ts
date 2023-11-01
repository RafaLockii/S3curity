import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { transporter } from '../services/nodemailer';
const speakeasy = require('speakeasy');

export const activate_2fa = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const existingTwoFactorAuth = await prisma.twoFactorAuth.findFirst({
            where: {
                userId: user.id,
            },
        });

        if (existingTwoFactorAuth) {
            const secret = speakeasy.generateSecret({ length: 6 });
            const code = secret.base32;

            await prisma.twoFactorAuth.update({
                where: {
                    id: existingTwoFactorAuth.id,
                },
                data: {
                    secretKey: code,
                    isVerified: false
                },
            });

            transporter.sendMail(
                {
                    from: 'jocyannovittor@hotmail.com',
                    to: email,
                    subject: 'Código de Autenticação 2FA',
                    text: `Sua chave secreta 2FA é: ${code}`,
                },
                (error: Error, info: any) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('Chave secreta 2FA enviada com sucesso: ' + info.response);
                    }
                }
            );

            res.status(200).json({ message: 'Chave secreta 2FA atualizada e enviada por email.' });
        } else {

            const secret = speakeasy.generateSecret({ length: 6 });
            const code = secret.base32;

            await prisma.twoFactorAuth.create({
                data: {
                    userId: user.id,
                    secretKey: code,
                },
            });

            transporter.sendMail(
                {
                    to: email,
                    subject: 'Código de Autenticação 2FA',
                    text: `Sua chave secreta 2FA é: ${code}`,
                },
                (error: Error, info: any) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('Chave secreta 2FA enviada com sucesso: ' + info.response);
                    }
                }
            );

            res.status(200).json({ message: 'Chave secreta 2FA gerada e enviada por email.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao ativar o 2FA.' });
    }
}

export const verify_2fa = async (req: Request, res: Response) => {
    const { email, code, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const twoFactorAuth = await prisma.twoFactorAuth.findFirst({
            where: {
                userId: user.id,
                secretKey: code,
                isVerified: false
            },
        });

        if (!twoFactorAuth) {
            return res.status(400).json({ message: '2FA não está ativado para este usuário.' });
        }

        if (twoFactorAuth) {

            await prisma.twoFactorAuth.update({
                where: {
                    userId: user.id,
                },
                data: {
                    isVerified: true,
                }
            })

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    senha: newPassword,
                },
            });

            return res.status(200).json({ message: '2FA verificado com sucesso e senha atualizada.' });
        } else {
            return res.status(401).json({ message: 'Código 2FA inválido.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao verificar o 2FA e atualizar a senha.' });
    }
}
