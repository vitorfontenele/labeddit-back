import express from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDatabase } from "../database/CommentDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { VotesCommentsDatabase } from "../database/VotesCommentsDatabase";
import { CommentDTO } from "../dtos/CommentDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new UserDatabase(),
        new VotesCommentsDatabase(),
        new CommentDTO(),
        new IdGenerator(),
        new TokenManager()
    ),
    new CommentDTO()
);

export const commentRouter = express.Router();

commentRouter.get("/", commentController.getComments);
commentRouter.get("/vote", commentController.getVotesComments);
commentRouter.post("/", commentController.createComment);
commentRouter.put("/:id/vote", commentController.updateCommentVotesById);