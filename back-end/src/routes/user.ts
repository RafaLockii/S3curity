import express from 'express';
import * as UserController from '../controllers/userController';

const userRoutes = express.Router();

userRoutes.get('/user/:id', UserController.getUser);
userRoutes.get('/users/all/:empresa', UserController.listUsers);
userRoutes.post('/user/create', UserController.createUser);
userRoutes.post('/user/ativar', UserController.ativarUser);
userRoutes.put('/user/edit/:id', UserController.editUser);
userRoutes.delete('/user/:id', UserController.deleteUser);

export default userRoutes;