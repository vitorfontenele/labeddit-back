import { Request , Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentDTO } from "../dtos/CommentDTO";
import { BaseError } from "../errors/BaseError";

export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness,
        private commentDTO: CommentDTO
    ){}

    public createComment = async (req: Request, res: Response) => {
        try {
            const content = req.body.content;
            const postId = req.params.id;
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
}