import * as DataController from "../controllers/menuUsersController";
import express from "express";

const dataRoutes = express.Router();

dataRoutes.get("/menus/:userId", DataController.getMenus);
dataRoutes.get("/itens/:userId", DataController.getItens);
dataRoutes.get("/relatorios/:userId", DataController.getRelatorio);
dataRoutes.get("/modulos/user/:userId", DataController.getModulosByUserId);
dataRoutes.get("/data/separated", DataController.getAllSeparatedData);
dataRoutes.get("/data/user/:userId", DataController.getSeparatedDataByUserId);

export default dataRoutes;
