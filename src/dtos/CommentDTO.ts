import { BadRequestError } from "../errors/BadRequestError";
import { Comment } from "../models/Comment";
import { CommentVote} from "../models/CommentVote";

export interface CreateCommentInputDTO {
    content: string,
    token: string,
    postId: string
}

export interface GetCommentInputDTO {
    token: string
}

export interface GetCommentByIdInputDTO {
    token: string
    id: string
}

export interface GetCommentOutputDTO {
    id: string,
    content: string,
    upvotes: number,
    downvotes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        username: string
    },
    postId: string
}

export interface EditCommentInputDTO {
    content: string
    id: string
    token: string
}

export interface EditCommentVoteInputDTO {
    id: string
    vote: boolean
    token: string
}

export interface GetCommentVoteInputDTO {
    token: string
}

export interface GetCommentVoteOutputDTO { 
    userId: string
    commentId: string
    vote: number
}

export interface DeleteCommentInputDTO {
    token : string
    id : string
}

export class CommentDTO {
    getCommentInput = (token: unknown) : GetCommentInputDTO => {
        if (typeof token !== "string"){
            throw new BadRequestError ("Token inválido"); 
        }

        const result : GetCommentInputDTO = {
            token
        }

        return result;
    }

    getCommentByIdInput = (token: unknown, id: string) : GetCommentByIdInputDTO => {
        // id string pois path param
        if (typeof token !== "string"){
            throw new BadRequestError ("Token inválido"); 
        }

        const result : GetCommentByIdInputDTO = {
            id,
            token
        }

        return result;
    }

    getCommentOutput = (comment: Comment) : GetCommentOutputDTO => {
        const result : GetCommentOutputDTO = {
            id: comment.getId(),
            content: comment.getContent(),
            upvotes: comment.getUpvotes(),
            downvotes: comment.getDownvotes(),
            createdAt: comment.getCreatedAt(),
            updatedAt: comment.getUpdatedAt(),
            creator: comment.getCreator(),
            postId: comment.getPostId()
        }

        return result;
    }

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

    editCommentInput = (token: unknown, content: unknown, id: string) : EditCommentInputDTO => {
        // id é string pois path param
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser string");
        }

        const result : EditCommentInputDTO = {
            id,
            token,
            content
        };

        return result;
    }

    editCommentVoteInput = (id: string, vote: unknown, token: unknown) : EditCommentVoteInputDTO => {
        // id é string pois é path param

        if (typeof vote !== "boolean"){
            throw new BadRequestError("'vote' deve ser um boolean");
        }
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : EditCommentVoteInputDTO = {
            id,
            vote,
            token
        }

        return result;
    }

    getCommentVoteInput = (token: unknown) : GetCommentVoteInputDTO => {
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : GetCommentVoteInputDTO = {
            token
        }

        return result;
    }

    getCommentVoteOutput = (commentVote: CommentVote) : GetCommentVoteOutputDTO => {
        const result : GetCommentVoteOutputDTO = {
            userId: commentVote.getUserId(),
            commentId: commentVote.getCommentId(),
            vote: commentVote.getVote()
        };

        return result;
    }

    deleteCommentInput = (token: unknown, id: string) : DeleteCommentInputDTO => {
        // id é string pois path param
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : DeleteCommentInputDTO = {
            id,
            token
        }

        return result;
    }
}