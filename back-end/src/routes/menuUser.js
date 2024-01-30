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
const DataController = __importStar(require("../controllers/menuUsersController"));
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const dataRoutes = express_1.default.Router();
dataRoutes.get("/menus/:userId", auth_1.autenticarToken, DataController.getMenus);
dataRoutes.get("/itens/:userId", auth_1.autenticarToken, DataController.getItens);
dataRoutes.get("/relatorios/:userId", auth_1.autenticarToken, DataController.getRelatorio);
dataRoutes.get("/modulos/user/:userId", auth_1.autenticarToken, DataController.getModulosByUserId);
dataRoutes.get("/data/separated", auth_1.autenticarToken, DataController.getAllSeparatedData);
dataRoutes.get("/data/user/:userId", auth_1.autenticarToken, DataController.getSeparatedDataByUserId);
exports.default = dataRoutes;
