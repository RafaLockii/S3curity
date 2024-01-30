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
exports.getSeparatedDataByUserId = exports.getAllSeparatedData = exports.getModulosByUserId = exports.getRelatorio = exports.getItens = exports.getMenus = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const getMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.userId;
    try {
        const user = yield prisma_1.default.user.findUnique({
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
        const formattedMenus = ((_a = user === null || user === void 0 ? void 0 : user.funcionario) === null || _a === void 0 ? void 0 : _a.menus.map((menu) => ({
            id: menu.id,
            nome: menu.nome,
            modulo: menu.modulos.nome
        }))) || [];
        res.status(200).json({ menus: formattedMenus });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
});
exports.getMenus = getMenus;
const getItens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = req.params.userId;
    try {
        const user = yield prisma_1.default.user.findUnique({
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
        const itens = ((_b = user === null || user === void 0 ? void 0 : user.funcionario) === null || _b === void 0 ? void 0 : _b.menus.flatMap((menu) => menu.itens.map((item) => ({
            id: item.id,
            nome: item.nome,
            menus_id: menu.id
        })))) || [];
        res.status(200).json({ itens });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get itens" });
    }
});
exports.getItens = getItens;
const getRelatorio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = req.params.userId;
    try {
        const user = yield prisma_1.default.user.findUnique({
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
        const relatorios = ((_c = user === null || user === void 0 ? void 0 : user.funcionario) === null || _c === void 0 ? void 0 : _c.menus.flatMap((menu) => menu.itens.flatMap((item) => item.relatorios.map((relatorio) => ({
            id: relatorio.id,
            nome: relatorio.nome,
            relatorio: relatorio.relatorio,
            itens_id: item.id
        }))))) || [];
        res.status(200).json({ relatorios });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get relatorios" });
    }
});
exports.getRelatorio = getRelatorio;
const getModulosByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = req.params.userId;
    try {
        const user = yield prisma_1.default.user.findUnique({
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
        const userModulos = ((_d = user === null || user === void 0 ? void 0 : user.funcionario) === null || _d === void 0 ? void 0 : _d.modulos) || [];
        res.status(200).json({ modulos: userModulos });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get modulos for the user" });
    }
});
exports.getModulosByUserId = getModulosByUserId;
const getAllSeparatedData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modulos = yield prisma_1.default.modulos.findMany();
        const menus = yield prisma_1.default.menus.findMany({
            include: {
                modulos: true
            }
        });
        const itens = yield prisma_1.default.itens.findMany();
        const relatorios = yield prisma_1.default.relatorios.findMany();
        res.status(200).json({
            modulos: modulos.map((modulo) => ({
                id: modulo.id,
                nome: modulo.nome
            })),
            menus: menus.map((menu) => ({
                id: menu.id,
                nome: menu.nome,
                modulos_id: menu.modulos_id,
                modulo: menu.modulos.nome
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get separated data" });
    }
});
exports.getAllSeparatedData = getAllSeparatedData;
const getSeparatedDataByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const funcionario = yield prisma_1.default.funcionario.findUnique({
            where: {
                usuario_id: parseInt(userId)
            }
        });
        if (!funcionario) {
            return res.status(404).json({ error: "Funcionario not found" });
        }
        const modulos = yield prisma_1.default.modulos.findMany({
            where: {
                usuarios: {
                    some: {
                        usuario_id: funcionario.usuario_id
                    }
                }
            }
        });
        const menus = yield prisma_1.default.menus.findMany({
            where: {
                usuarios: {
                    some: {
                        usuario_id: funcionario.usuario_id,
                    }
                }
            },
            include: {
                modulos: true
            }
        });
        const itens = yield prisma_1.default.itens.findMany({
            where: {
                usuarios: {
                    some: {
                        usuario_id: funcionario.usuario_id
                    }
                }
            }
        });
        const relatorios = yield prisma_1.default.relatorios.findMany({
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
                modulos_id: menu.modulos_id,
                modulo: menu.modulos.nome
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get separated data by user ID" });
    }
});
exports.getSeparatedDataByUserId = getSeparatedDataByUserId;
