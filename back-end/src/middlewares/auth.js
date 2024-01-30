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
exports.adminEmpresaOrS3curity = exports.adminAuthMiddlewareS3curity = exports.funcionarioAdminAuthMiddleware = exports.login = exports.autenticarToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
const bcrypt_1 = __importDefault(require("bcrypt"));
const chaveSecreta = (0, crypto_1.randomBytes)(256).toString("hex");
const autenticarToken = (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            console.log("Token não fornecido.");
            return res.status(401).json({ mensagem: "Token não fornecido." });
        }
        jsonwebtoken_1.default.verify(token, chaveSecreta, (erro, dadosDecodificados) => {
            if (erro) {
                console.log("Token inválido:", erro);
                return res.status(403).json({ mensagem: "Token inválido." });
            }
            //console.log('Dados do usuário decodificados:', dadosDecodificados);
            req.usuario = dadosDecodificados;
            next();
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ error: "Ocorreu um erro ao verificar Token." });
    }
};
exports.autenticarToken = autenticarToken;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const validPassword = yield bcrypt_1.default.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const Admin = yield prisma.funcionario.findUnique({
            where: { usuario_id: user.id }
        });
        if (!Admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        const token = jsonwebtoken_1.default.sign({ email }, chaveSecreta);
        // console.log('Token gerado:', token);
        return res.status(200).json({
            token: token,
            id: user.id,
            email: user.email,
            nome: user.nome,
            isAdmin: Admin.acesso_admin,
            fotoPerfil: Admin.imagem_perfil_id,
            ativo: user.verified
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ error: "Ocorreu um erro ao atualizar o usuário." });
    }
});
exports.login = login;
const funcionarioAdminAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = req.usuario;
        const Verified = yield prisma.user.findUnique({
            where: { email: User.email, verified: true }
        });
        if (!Verified) {
            return res.status(404).json({ error: "User not found" });
        }
        const ADMIN = yield prisma.funcionario.findUnique({
            where: { usuario_id: Verified.id, acesso_admin: true }
        });
        if (ADMIN && ADMIN.acesso_admin) {
            return next();
        }
        const error = {
            error: {
                message: "Não autorizado.",
                stack: "Não pode acessar a rota devido à falta de permissões de administrador.",
                status: 401
            }
        };
        throw error;
    }
    catch (error) {
        res
            .status(401)
            .send({ error: "Ocorreu erro ao verificar permissão ADMIN" });
    }
});
exports.funcionarioAdminAuthMiddleware = funcionarioAdminAuthMiddleware;
const adminAuthMiddlewareS3curity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = req.usuario;
        const UserExisting = yield prisma.user.findUnique({
            where: { email: User.email }
        });
        if (!UserExisting) {
            return res.status(404).json({ error: "User not found" });
        }
        const ExistingFuncionario = yield prisma.funcionario.findUnique({
            where: { usuario_id: UserExisting.id }
        });
        if (!ExistingFuncionario) {
            return res.status(404).json({ error: "Funcionario S3curity not found" });
        }
        if (ExistingFuncionario.empresa_id) {
            const BuscaEmpresa = yield prisma.empresa.findUnique({
                where: { id: ExistingFuncionario.empresa_id, nome: "s3curity" }
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
                stack: "Não pode acessar a rota devido à falta de permissões de administrador s3curity.",
                status: 401
            }
        };
        throw error;
    }
    catch (error) {
        res
            .status(401)
            .send({ error: "Ocorreu erro ao verificar permissão ADMIN" });
    }
});
exports.adminAuthMiddlewareS3curity = adminAuthMiddlewareS3curity;
const adminEmpresaOrS3curity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const User = req.usuario;
    try {
        const UserExisting = yield prisma.user.findUnique({
            where: { email: User.email }
        });
        if (!UserExisting) {
            return res.status(404).json({ error: "User not found" });
        }
        const ExistingFuncionario = yield prisma.funcionario.findUnique({
            where: { usuario_id: UserExisting.id, acesso_admin: true }
        });
        if (!ExistingFuncionario) {
            return res.status(404).json({ error: "Funcionario not found" });
        }
        if (ExistingFuncionario.empresa_id) {
            const BuscaEmpresa = yield prisma.empresa.findUnique({
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
                stack: "Não pode acessar a rota devido à falta de permissões de administrador s3curity.",
                status: 401
            }
        };
        throw error;
    }
    catch (error) {
        res
            .status(401)
            .send({ error: "Ocorreu erro ao verificar permissão ADMIN" });
    }
});
exports.adminEmpresaOrS3curity = adminEmpresaOrS3curity;
