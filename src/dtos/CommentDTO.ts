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

    editCommentVoteInput = (id: string, vote: unknown, token: unknown) => {
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
}