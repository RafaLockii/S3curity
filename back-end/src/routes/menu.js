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
const MenuController = __importStar(require("../controllers/menuController"));
const auth_1 = require("../middlewares/auth");
const menuRoutes = express_1.default.Router();
menuRoutes.post("/createmodulo", auth_1.autenticarToken, MenuController.createModulos);
menuRoutes.post("/menu/create", auth_1.autenticarToken, MenuController.createMenu);
// menuRoutes.post('/menu/create-user', MenuController.createMenuUser);
menuRoutes.put("/menu/edit/:id", auth_1.autenticarToken, MenuController.editMenu);
menuRoutes.delete("/menu/delete/:id", auth_1.autenticarToken, MenuController.deleteMenu);
menuRoutes.get("/menu/:id", auth_1.autenticarToken, MenuController.getMenu);
menuRoutes.get("/menus", auth_1.autenticarToken, MenuController.getAllMenus);
menuRoutes.get("/menus_front", auth_1.autenticarToken, MenuController.getMenus);
menuRoutes.get("/itens", auth_1.autenticarToken, MenuController.getItens);
menuRoutes.get("/relatorios", auth_1.autenticarToken, MenuController.getRelatorio);
menuRoutes.get("/modulos", auth_1.autenticarToken, MenuController.getAllModulos);
exports.default = menuRoutes;
