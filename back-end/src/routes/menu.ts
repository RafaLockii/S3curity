import express from 'express';
import * as MenuController from '../controllers/menuController';
import { autenticarToken } from '../middlewares/auth';

const menuRoutes = express.Router();

menuRoutes.post("/createmodulo", MenuController.createModulos);
menuRoutes.post("/menu/create", MenuController.createMenu);
// menuRoutes.post('/menu/create-user', MenuController.createMenuUser);
menuRoutes.put("/menu/edit/:id", MenuController.editMenu);
menuRoutes.delete("/menu/delete/:id", MenuController.deleteMenu);
menuRoutes.get("/menu/:id", MenuController.getMenu);
menuRoutes.get("/menus", MenuController.getAllMenus);
menuRoutes.get("/menus_front", MenuController.getMenus);
menuRoutes.get("/itens", MenuController.getItens);
menuRoutes.get("/relatorios", MenuController.getRelatorio);
menuRoutes.get("/modulos", MenuController.getAllModulos);

export default menuRoutes;