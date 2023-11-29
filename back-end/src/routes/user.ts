import express from "express";
import * as UserController from "../controllers/userController";
import { adminEmpresaOrS3curity, autenticarToken } from "../middlewares/auth";

const userRoutes = express.Router();

userRoutes.get("/user/:id", UserController.getUser);
userRoutes.get(
  "/users/all/:empresa",
  // autenticarToken, adminEmpresaOrS3curity,
  UserController.listUsers
);
userRoutes.post(
  "/user/create",
  // autenticarToken,
  // adminEmpresaOrS3curity,
  UserController.createUser
);
userRoutes.post("/user/ativar", UserController.ativarUser);
userRoutes.put(
  "/user/edit/:id",
  // autenticarToken,
  // adminEmpresaOrS3curity, UserController.editUser
);
userRoutes.delete(
  "/user/:id",
  // autenticarToken,
  // adminEmpresaOrS3curity,
  UserController.deleteUser
);
userRoutes.delete(
  "/delete-menu",
  // autenticarToken, adminEmpresaOrS3curity,
  UserController.deleteMenuUser
);
userRoutes.delete(
  "/delete-item",
  // autenticarToken, adminEmpresaOrS3curity,
  UserController.deleteItemWithReportsForUser
);
userRoutes.delete(
  "/delete-relatorio",
  // autenticarToken, adminEmpresaOrS3curity,
  UserController.deleteReportForItem
);

export default userRoutes;
