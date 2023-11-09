import express from 'express';
import * as MenuController from '../controllers/menuController';

const menuRoutes = express.Router();

menuRoutes.post('/createmodulo', MenuController.createModulos);
menuRoutes.post('/menu/create', MenuController.createMenu);
menuRoutes.put('/menu/edit/:id', MenuController.editMenu);
menuRoutes.delete('/menu/delete/:id', MenuController.deleteMenu);
menuRoutes.get('/menu/:id', MenuController.getMenu);
menuRoutes.get('/menu/:empresa_id/:modulo_id', MenuController.getMenusByEmpresaAndModulo);
menuRoutes.get('/menus', MenuController.getAllMenus);

export default menuRoutes;