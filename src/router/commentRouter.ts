import express from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDatabase } from "../database/CommentDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CommentDTO } from "../dtos/CommentDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new UserDatabase(),
        new CommentDTO(),
        new IdGenerator(),
        new TokenManager()
    ),
    new CommentDTO()
);

export const commentRouter = express.Router();

commentRouter.get("/", commentController.getComments);
commentRouter.post("/", commentController.createComment);