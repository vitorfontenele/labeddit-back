import { BadRequestError } from "../errors/BadRequestError";
import { Comment } from "../models/Comment";

export interface CreateCommentInputDTO {
    content: string,
    token: string,
    postId: string
}

export class CommentDTO {
    createCommentInput = (content: unknown, token: unknown, postId: unknown) : CreateCommentInputDTO => {
        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }

        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        if (typeof postId !== "string"){
            throw new BadRequestError("'postId' deve ser uma string");
        }

        const result : CreateCommentInputDTO = {
            content,
            token,
            postId
        }

        return result;
    }
}