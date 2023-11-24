import express from 'express';
import * as CargoController from '../controllers/cargoController';
import { autenticarToken } from '../middlewares/auth';

const cargoRoutes = express.Router();

cargoRoutes.get("/cargos/all", autenticarToken, CargoController.getAllCargos);
cargoRoutes.get("/cargos/:id", autenticarToken, CargoController.getCargoById);
cargoRoutes.post("/cargos/create", autenticarToken, CargoController.createCargo);
cargoRoutes.put("/cargos/:id", autenticarToken, CargoController.updateCargo);
cargoRoutes.delete("/cargos/:id", autenticarToken, CargoController.deleteCargo);

export default cargoRoutes;