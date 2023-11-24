import express from "express";
import * as EmpresaController from "../controllers/empresaController";
import {
  adminAuthMiddlewareS3curity,
  adminEmpresaOrS3curity,
  autenticarToken
} from "../middlewares/auth";

const empresaRouter = express.Router();

empresaRouter.get(
  "/empresas",
  autenticarToken,
  adminAuthMiddlewareS3curity,
  EmpresaController.listEmpresas
);
empresaRouter.get(
  "/empresa/:id",
  autenticarToken,
  EmpresaController.getEmpresa
);
empresaRouter.get(
  "/empresa_name/:nome",
  autenticarToken,
  EmpresaController.getEmpresaByName
);
empresaRouter.post(
  "/empresa/create",
  autenticarToken,
  adminAuthMiddlewareS3curity,
  EmpresaController.createEmpresa
);
empresaRouter.put(
  "/empresa/edit/:id",
  autenticarToken,
  adminAuthMiddlewareS3curity,
  EmpresaController.editEmpresa
);
empresaRouter.delete(
  "/empresa/:id",
  autenticarToken,
  adminAuthMiddlewareS3curity,
  EmpresaController.deleteEmpresa
);

export default empresaRouter;
