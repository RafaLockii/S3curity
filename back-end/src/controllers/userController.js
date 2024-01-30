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
exports.deleteReportForItem = exports.deleteItemWithReportsForUser = exports.deleteMenuUser = exports.ativarUser = exports.deleteUser = exports.listUsers = exports.getUser = exports.editUser = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const nodemailer_1 = require("../services/nodemailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const speakeasy = require("speakeasy");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { nome, senha, email, telefone, usuario_criacao, modulo_default, acesso_admin, empresa_id, imagem_perfil_url, modulos_id, menus_ids, itens_ids, relatorios_ids } = req.body;
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: "O e-mail já está em uso." });
        }
        const existingEmpresa = yield prisma_1.default.empresa.findUnique({
            where: {
                id: empresa_id
            }
        });
        if (!existingEmpresa) {
            return res
                .status(400)
                .json({ message: "A empresa especificada não foi encontrada." });
        }
        const modulos = yield prisma_1.default.modulos.findMany({
            where: { id: { in: modulos_id } }
        });
        const menus = yield prisma_1.default.menus.findMany({
            where: { id: { in: menus_ids } }
        });
        const itens = yield prisma_1.default.itens.findMany({
            where: { id: { in: itens_ids } }
        });
        const relatorios = yield prisma_1.default.relatorios.findMany({
            where: { id: { in: relatorios_ids } }
        });
        if (modulos.length !== modulos_id.length ||
            menus.length !== menus_ids.length ||
            itens.length !== itens_ids.length ||
            relatorios.length !== relatorios_ids.length) {
            return res
                .status(404)
                .json({
                error: "One or more modulos, menus, items or reports not found"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(senha, 10);
        const secret = speakeasy.generateSecret({ length: 6 });
        const code = secret.base32;
        const currentDatetime = new Date();
        const user = yield prisma_1.default.$transaction([
            prisma_1.default.user.create({
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
                                connect: modulos_id.map((id) => ({ id }))
                            },
                            menus: {
                                connect: menus_ids.map((id) => ({ id }))
                            },
                            itens: {
                                connect: itens_ids.map((id) => ({ id }))
                            },
                            relatorios: {
                                connect: relatorios_ids.map((id) => ({ id }))
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
            const createdImagem = yield prisma_1.default.imagem.create({
                data: {
                    url: imagem_perfil_url,
                    funcionario: {
                        connect: { id: user[0].funcionario.id }
                    }
                }
            });
            if (createdImagem) {
                const updatedFuncionario = yield prisma_1.default.funcionario.update({
                    where: { id: user[0].funcionario.id },
                    data: { imagem_perfil_id: createdImagem.id }
                });
            }
        }
        const funcionario = yield prisma_1.default.funcionario.findUnique({
            where: { id: (_a = user[0].funcionario) === null || _a === void 0 ? void 0 : _a.id }
        });
        if (!funcionario) {
            return res.status(404).json({ error: "Funcionario not found" });
        }
        if (user[0].token) {
            nodemailer_1.transporter.sendMail({
                to: email,
                subject: "Código de Ativação de Usuário",
                text: `Seu Token de Ativação é: ${code}`
            }, (error, info) => {
                if (error) {
                    console.error(error);
                }
                else {
                    console.log("Chave secreta 2FA enviada com sucesso: " + info.response);
                }
            });
        }
        res.status(201).json(user);
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Erro ao criar o usuário." });
    }
});
exports.createUser = createUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const { nome, senha, email, telefone, modulo_default, acesso_admin, empresa_id, imagem_perfil_url, modulos_id, menus_ids, itens_ids, relatorios_ids } = req.body;
        const existingUser = yield prisma_1.default.user.findUnique({
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
        let updateData = {};
        if (nome)
            updateData.nome = nome;
        if (senha) {
            const hashedPassword = yield bcrypt_1.default.hash(senha, 10);
            updateData.senha = hashedPassword;
        }
        if (email) {
            const existingUserWithEmail = yield prisma_1.default.user.findUnique({
                where: {
                    email: email
                }
            });
            if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
                return res.status(400).json({ message: "Email já está em uso." });
            }
            updateData.email = email;
        }
        if (telefone)
            updateData.telefone = telefone;
        const updatedUser = yield prisma_1.default.user.update({
            where: {
                id: userId
            },
            data: updateData
        });
        if (empresa_id) {
            const existingEmpresa = yield prisma_1.default.empresa.findUnique({
                where: {
                    id: empresa_id
                }
            });
            if (!existingEmpresa) {
                return res.status(404).json({ message: "Empresa não encontrado." });
            }
            const updatedFuncionario = yield prisma_1.default.user.update({
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
                                set: modulos_id.map((id) => ({ id }))
                            },
                            menus: {
                                set: menus_ids.map((id) => ({ id }))
                            },
                            itens: {
                                set: itens_ids.map((id) => ({ id }))
                            },
                            relatorios: {
                                set: relatorios_ids.map((id) => ({ id }))
                            }
                        }
                    }
                },
                include: {
                    funcionario: true
                }
            });
            const ImagemExist = yield prisma_1.default.imagem.findUnique({
                where: { funcionario_id: updatedFuncionario.id }
            });
            if (ImagemExist) {
                const updatedImagem = yield prisma_1.default.imagem.update({
                    where: {
                        funcionario_id: updatedFuncionario.id
                    },
                    data: {
                        url: imagem_perfil_url
                    }
                });
            }
            else if (existingUser.funcionario) {
                const createdImagem = yield prisma_1.default.imagem.create({
                    data: {
                        url: imagem_perfil_url,
                        funcionario_id: updatedFuncionario.id
                    }
                });
                const updatedImagem = yield prisma_1.default.funcionario.update({
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
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.editUser = editUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield prisma_1.default.user.findUnique({
            where: { id: Number(id) }
        });
        if (!usuario) {
            return res.status(404).json({ error: "Usuario not found" });
        }
        const user = yield prisma_1.default.funcionario.findUnique({
            where: { usuario_id: usuario.id },
            include: {
                menus: {
                    include: {
                        itens: {
                            include: {
                                relatorios: true
                            }
                        }
                    }
                },
                modulos: {}
            }
        });
        if (!user) {
            return res.status(404).json({ error: "Usuario not found" });
        }
        const structuredData = {
            id: user.id,
            modulo_default: user.modulo_default,
            acesso_admin: user.acesso_admin,
            ativo: usuario.verified,
            cadastro_alterado: user.cadastro_alterado,
            usuario_cad_alt: user.usuario_cad_alt,
            usuario_id: user.usuario_id,
            empresa_id: user.empresa_id,
            modulos: user.modulos.map((modulo) => ({
                id: modulo.id,
                nome: modulo.nome
            })),
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
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.getUser = getUser;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const empresaNome = req.params.empresa;
    try {
        if (empresaNome === "s3curity") {
            const users = yield prisma_1.default.user.findMany({
                include: {
                    funcionario: {
                        include: {
                            imagem: true,
                            empresa: true,
                            modulos: true
                        }
                    }
                }
            });
            const formattedUsers = users.map((user) => {
                var _a, _b, _c, _d, _e, _f;
                return (Object.assign(Object.assign({}, user), { funcionario: Object.assign(Object.assign({}, user.funcionario), { cadastro_alterado: ((_b = (_a = user.funcionario) === null || _a === void 0 ? void 0 : _a.cadastro_alterado) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || null, empresa: Object.assign(Object.assign({}, (_c = user.funcionario) === null || _c === void 0 ? void 0 : _c.empresa), { data_criacao: ((_f = (_e = (_d = user.funcionario) === null || _d === void 0 ? void 0 : _d.empresa) === null || _e === void 0 ? void 0 : _e.data_criacao) === null || _f === void 0 ? void 0 : _f.toLocaleString()) || null }) }) }));
            });
            res.status(200).json(formattedUsers);
        }
        else {
            const empresa = yield prisma_1.default.empresa.findUnique({
                where: {
                    nome: empresaNome
                }
            });
            if (!empresa) {
                return res.status(404).json({ message: "Empresa não encontrada." });
            }
            const users = yield prisma_1.default.user.findMany({
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
            const formattedUsers = users.map((user) => {
                var _a, _b, _c, _d, _e, _f;
                return (Object.assign(Object.assign({}, user), { funcionario: Object.assign(Object.assign({}, user.funcionario), { cadastro_alterado: ((_b = (_a = user.funcionario) === null || _a === void 0 ? void 0 : _a.cadastro_alterado) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || null, empresa: Object.assign(Object.assign({}, (_c = user.funcionario) === null || _c === void 0 ? void 0 : _c.empresa), { data_criacao: ((_f = (_e = (_d = user.funcionario) === null || _d === void 0 ? void 0 : _d.empresa) === null || _e === void 0 ? void 0 : _e.data_criacao) === null || _f === void 0 ? void 0 : _f.toLocaleString()) || null }) }) }));
            });
            res.status(200).json(formattedUsers);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao listar os usuários." });
    }
});
exports.listUsers = listUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
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
        const deletedUser = yield prisma_1.default.user.delete({
            where: { id: Number(id) }
        });
        return res.json(deletedUser);
    }
    catch (error) {
        return res.status(500).json({ error: "Falha ao deletar" });
    }
});
exports.deleteUser = deleteUser;
const ativarUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({
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
        const userVerified = yield prisma_1.default.user.findFirst({
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
            yield prisma_1.default.user.update({
                where: {
                    email: email
                },
                data: {
                    verified: true
                }
            });
            return res.status(200).json({ message: "Usuário ativado com sucesso." });
        }
        else {
            return res.status(401).json({ message: "Código Token inválido." });
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Erro ao verificar o 2FA e atualizar a senha." });
    }
});
exports.ativarUser = ativarUser;
const deleteMenuUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, menuId } = req.body;
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
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
        yield prisma_1.default.funcionario.update({
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
                    disconnect: existingUser.funcionario.itens.map((item) => ({
                        id: item.id
                    }))
                },
                relatorios: {
                    deleteMany: {
                        id: {
                            in: existingUser.funcionario.itens.flatMap((item) => item.relatorios.map((relatorio) => relatorio.id))
                        }
                    }
                }
            }
        });
        res.status(200).json({
            message: "Relacionamento de menu de usuário excluído com sucesso."
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.deleteMenuUser = deleteMenuUser;
const deleteItemWithReportsForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, itemId } = req.body;
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
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
        yield prisma_1.default.itens.delete({
            where: {
                id: Number(itemId)
            }
        });
        // Busca os relatórios associados ao item para esse usuário e exclui-os
        const relatoriosDoItem = yield prisma_1.default.relatorios.findMany({
            where: {
                itens_id: Number(itemId)
            }
        });
        const relatorioIds = relatoriosDoItem.map((relatorio) => relatorio.id);
        yield prisma_1.default.relatorios.deleteMany({
            where: {
                id: {
                    in: relatorioIds
                }
            }
        });
        res.status(200).json({
            message: "Item e seus relatórios associados foram removidos com sucesso para o usuário especificado."
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.deleteItemWithReportsForUser = deleteItemWithReportsForUser;
const deleteReportForItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, itemId, reportId } = req.body;
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        const item = yield prisma_1.default.itens.findFirst({
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
        const report = yield prisma_1.default.relatorios.findFirst({
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
        yield prisma_1.default.relatorios.delete({
            where: {
                id: Number(reportId)
            }
        });
        return res.status(200).json({
            message: "Relatório removido com sucesso para o item especificado."
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erro ao remover o relatório para o item especificado."
        });
    }
});
exports.deleteReportForItem = deleteReportForItem;
