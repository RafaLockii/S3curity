"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmpresaController = __importStar(require("../controllers/empresaController"));
const auth_1 = require("../middlewares/auth");
const empresaRouter = express_1.default.Router();
empresaRouter.get("/empresas", auth_1.autenticarToken, auth_1.adminAuthMiddlewareS3curity, EmpresaController.listEmpresas);
empresaRouter.get("/empresa/:id", auth_1.autenticarToken, EmpresaController.getEmpresa);
empresaRouter.get("/empresa_name/:nome", auth_1.autenticarToken, EmpresaController.getEmpresaByName);
empresaRouter.get("/empresa-carrossel-logo/:nome", EmpresaController.getCarrosseisELogoEmpresa);
empresaRouter.post("/empresa/create", auth_1.autenticarToken, auth_1.adminAuthMiddlewareS3curity, EmpresaController.createEmpresa);
empresaRouter.put("/empresa/edit/:id", auth_1.autenticarToken, auth_1.adminAuthMiddlewareS3curity, EmpresaController.editEmpresa);
empresaRouter.delete("/empresa/:id", auth_1.autenticarToken, auth_1.adminAuthMiddlewareS3curity, EmpresaController.deleteEmpresa);
exports.default = empresaRouter;
