import { Request , Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentDTO } from "../dtos/CommentDTO";
import { BaseError } from "../errors/BaseError";

export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness,
        private commentDTO: CommentDTO
    ){}

    public getComments = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;

            const input = this.commentDTO.getCommentInput(token);
            const output = await this.commentBusiness.getComments(input);

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

    public getCommentById = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const id = req.params.id;

            const input = this.commentDTO.getCommentByIdInput(token, id);
            const output = await this.commentBusiness.getCommentById(input);

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

    public getCommentVotes = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;

            const input = this.commentDTO.getCommentVoteInput(token);
            const output = await this.commentBusiness.getCommentVotes(input);

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

    public createComment = async (req: Request, res: Response) => {
        try {
            const content = req.body.content;
            const postId = req.body.postId;
            const token = req.headers.authorization;

            const input = this.commentDTO.createCommentInput(content, token, postId);
            await this.commentBusiness.createComment(input);

            res.status(201).send("Comentário criado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public updateCommentById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const content = req.body.content;
            const token = req.headers.authorization;

            const input = this.commentDTO.editCommentInput(token, content, id);
            const output = await this.commentBusiness.updateCommentById(input);

            res.status(200).send("Comentário atualizado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public updateCommentVoteById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const vote = req.body.vote;
            const token = req.headers.authorization;

            const input = this.commentDTO.editCommentVoteInput(id, vote, token);
            await this.commentBusiness.updateCommentVoteById(input);

            res.status(200).send("Vote atualizado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deleteCommentById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const token = req.headers.authorization;

            const input = this.commentDTO.deleteCommentInput(token, id);
            await this.commentBusiness.deleteCommentById(input);

            res.status(200).send("Comentário deletado com sucesso");
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