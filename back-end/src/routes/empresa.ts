import express from "express";
import * as EmpresaController from "../controllers/empresaController";
import {
  adminAuthMiddlewareS3curity,
  adminEmpresaOrS3curity
} from "../middlewares/auth";

const empresaRouter = express.Router();

empresaRouter.get(
  "/empresas",
  EmpresaController.listEmpresas
);
empresaRouter.get(
  "/empresa/:id",
  EmpresaController.getEmpresa
);
empresaRouter.get(
  "/empresa_name/:nome",
  EmpresaController.getEmpresaByName
);
empresaRouter.get(
  "/empresa-carrossel-logo/:nome",
  EmpresaController.getCarrosseisELogoEmpresa
);
empresaRouter.post(
  "/empresa/create",
  EmpresaController.createEmpresa
);
empresaRouter.put(
  "/empresa/edit/:id",
  EmpresaController.editEmpresa
);
empresaRouter.delete(
  "/empresa/:id",
  EmpresaController.deleteEmpresa
);

export default empresaRouter;
