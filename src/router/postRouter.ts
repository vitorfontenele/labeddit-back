import express from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { PostVotesDatabase } from "../database/PostVotesDatabase";
import { PostDTO } from "../dtos/PostDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new CommentDatabase(),
        new PostVotesDatabase(),
        new PostDTO(),
        new IdGenerator(),
        new TokenManager()
    ),
    new PostDTO()
);

export const postRouter = express.Router();

postRouter.get("/", postController.getPosts);
postRouter.get("/votes", postController.getPostVotes);
postRouter.get("/:id", postController.getPostById);
postRouter.post("/", postController.createPost);
// postRouter.put("/:id", postController.updatePostById);
postRouter.put("/:id/vote", postController.updatePostVoteById);
postRouter.delete("/:id", postController.deletePostById);