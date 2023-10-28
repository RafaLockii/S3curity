import express from 'express';
import * as CargoController from '../controllers/cargoController';

const cargoRoutes = express.Router();

cargoRoutes.get('/cargos/all', CargoController.getAllCargos);
cargoRoutes.get('/cargos/:id', CargoController.getCargoById);
cargoRoutes.post('/cargos/create', CargoController.createCargo);
cargoRoutes.put('/cargos/:id', CargoController.updateCargo);
cargoRoutes.delete('/cargos/:id', CargoController.deleteCargo);

export default cargoRoutes;