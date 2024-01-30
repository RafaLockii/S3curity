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
const UserController = __importStar(require("../controllers/userController"));
const auth_1 = require("../middlewares/auth");
const userRoutes = express_1.default.Router();
userRoutes.get("/user/:id", auth_1.autenticarToken, UserController.getUser);
userRoutes.get("/users/all/:empresa", auth_1.autenticarToken, auth_1.adminEmpresaOrS3curity, UserController.listUsers);
userRoutes.post("/user/create", auth_1.autenticarToken, auth_1.adminEmpresaOrS3curity, UserController.createUser);
userRoutes.post("/user/ativar", UserController.ativarUser);
userRoutes.put("/user/edit/:id", auth_1.autenticarToken, auth_1.adminEmpresaOrS3curity, UserController.editUser);
userRoutes.delete("/user/:id", auth_1.autenticarToken, auth_1.adminEmpresaOrS3curity, UserController.deleteUser);
userRoutes.delete("/delete-menu", auth_1.autenticarToken, auth_1.adminEmpresaOrS3curity, UserController.deleteMenuUser);
userRoutes.delete("/delete-item", auth_1.autenticarToken, auth_1.adminEmpresaOrS3curity, UserController.deleteItemWithReportsForUser);
userRoutes.delete("/delete-relatorio", auth_1.autenticarToken, auth_1.adminEmpresaOrS3curity, UserController.deleteReportForItem);
exports.default = userRoutes;
