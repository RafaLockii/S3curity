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
exports.getAllModulos = exports.getRelatorio = exports.getItens = exports.getMenus = exports.getAllMenus = exports.getMenu = exports.deleteMenu = exports.editMenu = exports.createMenu = exports.createModulos = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const createModulos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { modulos } = req.body;
        const createdModulos = yield prisma_1.default.modulos.createMany({
            data: modulos.map((modulo) => ({
                nome: modulo.nome,
            })),
        });
        res.status(201).json({ modulos: createdModulos });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Modulos creation failed" });
    }
});
exports.createModulos = createModulos;
const createMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomeMenu, itens, modulo_id, } = req.body;
    try {
        const modulo = yield prisma_1.default.modulos.findUnique({
            where: { id: modulo_id },
        });
        if (!modulo) {
            return res.status(404).json({ error: "Modulo not found" });
        }
        const createdMenu = yield prisma_1.default.menus.create({
            data: {
                nome: nomeMenu,
                modulos: {
                    connect: { id: modulo_id },
                },
                itens: {
                    create: itens.map((item) => ({
                        nome: item.nomeItem,
                        relatorios: {
                            create: item.relatorios.map((relatorio) => ({
                                nome: relatorio.nome,
                                relatorio: relatorio.relatorio,
                            })),
                        },
                    })),
                },
            },
        });
        res.status(201).json({ menu: createdMenu });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Item creation failed" });
    }
});
exports.createMenu = createMenu;
const editMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nomeMenu, itens } = req.body;
        const menu = yield prisma_1.default.menus.findUnique({
            where: { id: Number(id) },
        });
        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }
        const updatedMenu = yield prisma_1.default.menus.update({
            where: { id: Number(id) },
            data: {
                nome: nomeMenu,
                itens: {
                    update: itens.map((item) => ({
                        where: { id: item.id },
                        data: {
                            nome: item.nomeItem,
                            relatorios: {
                                update: item.relatorios.map((relatorio) => ({
                                    where: { id: relatorio.id },
                                    data: {
                                        nome: relatorio.nome,
                                        relatorio: relatorio.relatorio,
                                    },
                                })),
                            },
                        },
                    })),
                },
            },
        });
        res.status(200).json({ menu: updatedMenu });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Item update failed" });
    }
});
exports.editMenu = editMenu;
const deleteMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const menu = yield prisma_1.default.menus.findUnique({
            where: { id: Number(id) },
            include: { itens: { include: { relatorios: true } } },
        });
        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }
        for (const item of menu.itens) {
            for (const relatorio of item.relatorios) {
                yield prisma_1.default.relatorios.delete({
                    where: { id: relatorio.id },
                });
            }
            yield prisma_1.default.itens.delete({
                where: { id: item.id },
            });
        }
        yield prisma_1.default.menus.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "Menu deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Item deletion failed" });
    }
});
exports.deleteMenu = deleteMenu;
const getMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const menu = yield prisma_1.default.menus.findUnique({
            where: { id: Number(id) },
            include: { itens: { include: { relatorios: true } } },
        });
        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }
        res.status(200).json({ menu });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menu" });
    }
});
exports.getMenu = getMenu;
const getAllMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield prisma_1.default.menus.findMany({
            include: {
                modulos: true,
                itens: { include: { relatorios: true } },
            },
        });
        const formattedMenus = menus.map(menu => ({
            id: menu.id,
            nome: menu.nome,
            modulo: menu.modulos.nome,
            itens: menu.itens
        }));
        res.status(200).json({ menus: formattedMenus });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
});
exports.getAllMenus = getAllMenus;
const getMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield prisma_1.default.menus.findMany({
            include: {
                modulos: true,
            },
        });
        const formattedMenus = menus.map(menu => ({
            id: menu.id,
            nome: menu.nome,
            modulo: menu.modulos.nome,
        }));
        res.status(200).json({ menus: formattedMenus });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
});
exports.getMenus = getMenus;
const getItens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield prisma_1.default.menus.findMany({
            include: {
                modulos: true,
                itens: { include: { relatorios: true } },
            },
        });
        const itens = menus.flatMap(menu => {
            return menu.itens.map(item => {
                return {
                    id: item.id,
                    nome: item.nome,
                    menus_id: menu.id,
                };
            });
        });
        res.status(200).json({ itens: itens });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
});
exports.getItens = getItens;
const getRelatorio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield prisma_1.default.menus.findMany({
            include: {
                modulos: true,
                itens: { include: { relatorios: true } },
            },
        });
        const itens = menus.flatMap(menu => {
            return menu.itens.map(item => {
                return {
                    id: item.id,
                    nome: item.nome,
                    menus_id: menu.id,
                    relatorios: item.relatorios
                };
            });
        });
        const relatorios = itens.flatMap(item => {
            return item.relatorios.map(relatorio => {
                return {
                    id: relatorio.id,
                    nome: relatorio.nome,
                    relatorio: relatorio.relatorio,
                    itens_id: item.id,
                };
            });
        });
        res.status(200).json({ relatorios: relatorios });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get menus" });
    }
});
exports.getRelatorio = getRelatorio;
const getAllModulos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modulos = yield prisma_1.default.modulos.findMany();
        res.json({ modulos });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Falha ao buscar módulos" });
    }
});
exports.getAllModulos = getAllModulos;
