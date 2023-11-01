import * as TokenController from '../controllers/verifyTokenController';
import express from 'express';

const tokenRoutes = express.Router();

tokenRoutes.post('/activate-2fa', TokenController.activate_2fa);
tokenRoutes.post('/verify-2fa', TokenController.verify_2fa);

export default tokenRoutes;