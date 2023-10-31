import * as UserLoginController from '../middlewares/auth';
import express from 'express';

const loginRoutes = express.Router();

loginRoutes.post('/login', UserLoginController.login);

export default loginRoutes;