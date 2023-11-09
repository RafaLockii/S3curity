import express from 'express';
import * as EmpresaController from '../controllers/empresaController';
import { adminAuthMiddleware, autenticarToken } from '../middlewares/auth';

const empresaRouter = express.Router();

empresaRouter.get('/empresas', EmpresaController.listEmpresas);
empresaRouter.get('/empresa/:id', EmpresaController.getEmpresa);
empresaRouter.post('/empresa/create', EmpresaController.createEmpresa);
empresaRouter.put('/empresa/edit/:id', EmpresaController.editEmpresa);
empresaRouter.delete('/empresa/:id', EmpresaController.deleteEmpresa);

export default empresaRouter;