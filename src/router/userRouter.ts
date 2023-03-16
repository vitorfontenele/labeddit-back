import express from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserController } from "../controller/UserController";
import { UserDatabase } from "../database/UserDatabase";
import { UserDTO } from "../dtos/UserDTO";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new UserDTO(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    ), 
    new UserDTO()
);

export const userRouter = express.Router();

userRouter.get("/", userController.getUsers);
userRouter.get("/verify-token/:token", userController.verifyToken);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.delete("/:id", userController.deleteUserById);
