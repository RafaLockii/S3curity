import * as DataController from "../controllers/menuUsersController";
import express from "express";
import { autenticarToken } from "../middlewares/auth";

const dataRoutes = express.Router();

dataRoutes.get("/menus/:userId", autenticarToken, DataController.getMenus);
dataRoutes.get("/itens/:userId", autenticarToken, DataController.getItens);
dataRoutes.get(
  "/relatorios/:userId",
  autenticarToken,
  DataController.getRelatorio
);
dataRoutes.get(
  "/modulos/user/:userId",
  autenticarToken,
  DataController.getModulosByUserId
);
dataRoutes.get(
  "/data/separated",
  autenticarToken,
  DataController.getAllSeparatedData
);
dataRoutes.get(
  "/data/user/:userId",
  autenticarToken,
  DataController.getSeparatedDataByUserId
);

export default dataRoutes;
