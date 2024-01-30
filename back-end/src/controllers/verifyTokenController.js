"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_2fa = exports.activate_2fa = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const nodemailer_1 = require("../services/nodemailer");
const speakeasy = require('speakeasy');
const activate_2fa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const existingTwoFactorAuth = yield prisma_1.default.twoFactorAuth.findFirst({
            where: {
                userId: user.id,
            },
        });
        if (existingTwoFactorAuth) {
            const secret = speakeasy.generateSecret({ length: 6 });
            const code = secret.base32;
            yield prisma_1.default.twoFactorAuth.update({
                where: {
                    id: existingTwoFactorAuth.id,
                },
                data: {
                    secretKey: code,
                    isVerified: false
                },
            });
            nodemailer_1.transporter.sendMail({
                to: email,
                subject: 'Código de Autenticação 2FA',
                text: `Sua chave secreta 2FA é: ${code}`,
            }, (error, info) => {
                if (error) {
                    console.error(error);
                }
                else {
                    console.log('Chave secreta 2FA enviada com sucesso: ' + info.response);
                }
            });
            res.status(200).json({ message: 'Chave secreta 2FA atualizada e enviada por email.' });
        }
        else {
            const secret = speakeasy.generateSecret({ length: 6 });
            const code = secret.base32;
            yield prisma_1.default.twoFactorAuth.create({
                data: {
                    userId: user.id,
                    secretKey: code,
                },
            });
            nodemailer_1.transporter.sendMail({
                to: email,
                subject: 'Código de Autenticação 2FA',
                text: `Sua chave secreta 2FA é: ${code}`,
            }, (error, info) => {
                if (error) {
                    console.error(error);
                }
                else {
                    console.log('Chave secreta 2FA enviada com sucesso: ' + info.response);
                }
            });
            res.status(200).json({ message: 'Chave secreta 2FA gerada e enviada por email.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao ativar o 2FA.' });
    }
});
exports.activate_2fa = activate_2fa;
const verify_2fa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code, newPassword } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const twoFactorAuth = yield prisma_1.default.twoFactorAuth.findFirst({
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
            yield prisma_1.default.twoFactorAuth.update({
                where: {
                    userId: user.id,
                },
                data: {
                    isVerified: true,
                }
            });
            yield prisma_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    senha: newPassword,
                },
            });
            return res.status(200).json({ message: '2FA verificado com sucesso e senha atualizada.' });
        }
        else {
            return res.status(401).json({ message: 'Código 2FA inválido.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao verificar o 2FA e atualizar a senha.' });
    }
});
exports.verify_2fa = verify_2fa;
