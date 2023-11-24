import express from 'express';
import * as MenuController from '../controllers/menuController';
import { autenticarToken } from '../middlewares/auth';

const menuRoutes = express.Router();

menuRoutes.post("/createmodulo", autenticarToken, MenuController.createModulos);
menuRoutes.post("/menu/create", autenticarToken, MenuController.createMenu);
// menuRoutes.post('/menu/create-user', MenuController.createMenuUser);
menuRoutes.put("/menu/edit/:id", autenticarToken, MenuController.editMenu);
menuRoutes.delete("/menu/delete/:id", autenticarToken, MenuController.deleteMenu);
menuRoutes.get("/menu/:id", autenticarToken, MenuController.getMenu);
menuRoutes.get("/menus", autenticarToken, MenuController.getAllMenus);
menuRoutes.get("/menus_front", autenticarToken, MenuController.getMenus);
menuRoutes.get("/itens", autenticarToken, MenuController.getItens);
menuRoutes.get("/relatorios", autenticarToken, MenuController.getRelatorio);
menuRoutes.get("/modulos", autenticarToken, MenuController.getAllModulos);

export default menuRoutes;