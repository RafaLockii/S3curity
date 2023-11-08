import * as LogoController from '../controllers/logoController';
import express from 'express';

const logoRoutes = express.Router();

logoRoutes.get('/logo/:empresa', LogoController.getLogoeCarrossel);

export default logoRoutes;