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
exports.getCarrosseisELogoEmpresa = exports.getEmpresaByName = exports.getEmpresa = exports.listEmpresas = exports.deleteEmpresa = exports.editEmpresa = exports.createEmpresa = void 0;
const prisma_1 = __importDefault(require("../services/prisma"));
const createEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, razao_s, logo, imagem_fundo, usuario_criacao, carrosselImagens } = req.body;
    if (!nome || !razao_s || !logo || !imagem_fundo || !usuario_criacao) {
        return res.status(400).json({ message: 'Dados de entrada inválidos.' });
    }
    try {
        const existingEmpresa = yield prisma_1.default.empresa.findUnique({
            where: {
                nome,
            },
        });
        if (existingEmpresa) {
            return res.status(400).json({ message: 'A empresa já existe.' });
        }
        const currentDatetime = new Date();
        currentDatetime.setHours(currentDatetime.getHours() - 3);
        const empresa = yield prisma_1.default.empresa.create({
            data: {
                nome,
                razao_s,
                logo,
                imagem_fundo,
                data_criacao: currentDatetime,
                usuario_criacao,
            },
        });
        if (carrosselImagens.length > 0) {
            const carrossel = yield prisma_1.default.carrossel.createMany({
                data: carrosselImagens.map((imagem) => ({
                    nome: imagem,
                    empresa_id: empresa.id,
                    data_criacao: currentDatetime,
                })),
            });
        }
        res.status(201).json({ empresa });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar empresa' });
    }
});
exports.createEmpresa = createEmpresa;
const editEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nome, razao_s, logo, imagem_fundo, usuario_criacao, carrosselImagens } = req.body;
    let updateData = {};
    if (nome)
        updateData.nome = nome;
    if (razao_s)
        updateData.razao_s = razao_s;
    if (logo)
        updateData.logo = logo;
    if (imagem_fundo)
        updateData.imagem_fundo = imagem_fundo;
    if (usuario_criacao)
        updateData.usuario_criacao = usuario_criacao;
    const currentDatetime = new Date();
    currentDatetime.setHours(currentDatetime.getHours() - 3);
    updateData.data_alt = currentDatetime;
    try {
        const empresa = yield prisma_1.default.empresa.update({
            where: { id: Number(id) },
            data: updateData
        });
        if (carrosselImagens.length > 0) {
            yield prisma_1.default.carrossel.deleteMany({
                where: { empresa_id: Number(id) },
            });
            yield prisma_1.default.carrossel.createMany({
                data: carrosselImagens.map((imagem) => ({
                    nome: imagem,
                    empresa_id: empresa.id,
                    data_criacao: currentDatetime,
                })),
            });
        }
        res.status(200).json({ empresa });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar empresa' });
    }
});
exports.editEmpresa = editEmpresa;
const deleteEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const empresaId = parseInt(req.params.id);
    try {
        const existingEmpresa = yield prisma_1.default.empresa.findUnique({
            where: { id: empresaId }
        });
        if (!existingEmpresa) {
            return res.status(404).json({ message: "Empresa não encontrada." });
        }
        yield prisma_1.default.carrossel.deleteMany({
            where: { empresa_id: empresaId }
        });
        yield prisma_1.default.imagem.deleteMany({
            where: { funcionario_id: empresaId }
        });
        yield prisma_1.default.funcionario.deleteMany({
            where: { empresa_id: empresaId }
        });
        yield prisma_1.default.empresa.delete({
            where: { id: empresaId }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir a empresa.' });
    }
});
exports.deleteEmpresa = deleteEmpresa;
const listEmpresas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresas = yield prisma_1.default.empresa.findMany({
            include: {
                carrosseis: true,
                funcionarios: true,
            },
        });
        const formattedEmpresas = empresas.map((empresa) => (Object.assign(Object.assign({}, empresa), { data_criacao: empresa.data_criacao.toLocaleString(), carrosseis: empresa.carrosseis.map((carrossel) => (Object.assign(Object.assign({}, carrossel), { data_criacao: carrossel.data_criacao.toLocaleString() }))) })));
        res.status(200).json(formattedEmpresas);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar as empresas.' });
    }
});
exports.listEmpresas = listEmpresas;
const getEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const empresaId = parseInt(req.params.id);
    try {
        const empresa = yield prisma_1.default.empresa.findUnique({
            where: { id: empresaId },
            include: {
                carrosseis: true,
                funcionarios: true,
            },
        });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }
        const formattedEmpresa = {
            id: empresa.id,
            nome: empresa.nome,
            razao_s: empresa.razao_s,
            logo: empresa.logo,
            data_alt: empresa.data_alt,
            imagem_fundo: empresa.imagem_fundo,
            usuario_criacao: empresa.usuario_criacao,
            data_criacao: empresa.data_criacao.toLocaleString(),
            usuario_cad_alt: empresa.usuario_cad_alt,
            carrosseis: empresa.carrosseis,
            numero_funcionarios: empresa.funcionarios.length,
        };
        res.status(200).json(formattedEmpresa);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar as informações da empresa.' });
    }
});
exports.getEmpresa = getEmpresa;
const getEmpresaByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.params.nome;
    try {
        const empresa = yield prisma_1.default.empresa.findUnique({
            where: {
                nome: nome,
            },
            include: {
                carrosseis: true,
                funcionarios: true,
            },
        });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }
        const formattedEmpresa = {
            id: empresa.id,
            nome: empresa.nome,
            razao_s: empresa.razao_s,
            logo: empresa.logo,
            data_alt: empresa.data_alt,
            imagem_fundo: empresa.imagem_fundo,
            usuario_criacao: empresa.usuario_criacao,
            data_criacao: empresa.data_criacao.toLocaleString(),
            usuario_cad_alt: empresa.usuario_cad_alt,
            carrosseis: empresa.carrosseis,
        };
        if (!formattedEmpresa) {
            res.status(404).json({ error: "Empresa not found" });
            return;
        }
        res.status(200).json({ formattedEmpresa });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get empresa" });
    }
});
exports.getEmpresaByName = getEmpresaByName;
const getCarrosseisELogoEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.params.nome;
    try {
        const empresa = yield prisma_1.default.empresa.findUnique({
            where: {
                nome: nome,
            }, select: {
                logo: true,
                imagem_fundo: true,
                carrosseis: true,
            },
        });
        if (!empresa) {
            res.status(404).json({ error: "Empresa not found" });
            return;
        }
        res.status(200).json({ empresa });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get empresa" });
    }
});
exports.getCarrosseisELogoEmpresa = getCarrosseisELogoEmpresa;
