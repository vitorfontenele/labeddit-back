import { Request , Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostDTO } from "../dtos/PostDTO";
import { BaseError } from "../errors/BaseError";

export class PostController {
    constructor(
        private postBusiness : PostBusiness,
        private postDTO : PostDTO
    ){}
    
    public getPosts = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;

            const input = this.postDTO.getPostInput(token);
            const output = await this.postBusiness.getPosts(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public getPostById = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const id = req.params.id;

            const input = this.postDTO.getPostByIdInput(token, id);
            const output = await this.postBusiness.getPostById(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const content = req.body.content;
            const token = req.headers.authorization;

            const input = this.postDTO.createPostInput(content, token);
            await this.postBusiness.createPost(input);

            res.status(201).send("Post criado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public updatePostVotesById = async(req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const upvote = req.body.upvote;
            const token = req.headers.authorization;

            const input = this.postDTO.editPostVotesInput(id, upvote, token);
            await this.postBusiness.updatePostVotesById(input);

            res.status(200).send("Upvote atualizado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePostById = async(req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const token = req.headers.authorization;

            const input = this.postDTO.deletePostInput(id, token);
            await this.postBusiness.deletePostById(input);

            res.status(200).send("Post deletado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}