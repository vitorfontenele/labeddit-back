import express from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDatabase } from "../database/CommentDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CommentVotesDatabase } from "../database/CommentVotesDatabase";
import { CommentDTO } from "../dtos/CommentDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostDatabase } from "../database/PostDatabase";

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new UserDatabase(),
        new CommentVotesDatabase(),
        new CommentDTO(),
        new IdGenerator(),
        new TokenManager()
    ),
    new CommentDTO()
);

export const commentRouter = express.Router();

commentRouter.get("/", commentController.getComments);
commentRouter.get("/votes", commentController.getCommentVotes);
commentRouter.get("/:id", commentController.getCommentById);
commentRouter.post("/", commentController.createComment);
commentRouter.put("/:id", commentController.updateCommentById);
commentRouter.put("/:id/vote", commentController.updateCommentVoteById);
commentRouter.delete("/:id", commentController.deleteCommentById);