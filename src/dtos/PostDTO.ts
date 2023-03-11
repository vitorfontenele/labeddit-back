import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";

export interface CreatePostInputDTO {
    content : string
    token: string
}

export interface EditPostInputDTO {
    id : string
    content : string
    token: string
}

export interface EditPostVotesInputDTO {
    id : string
    upvote : boolean
    token: string
}

export interface GetPostInputDTO {
    token: string
}

export interface GetPostOutputDTO {
    id : string
    content : string
    upvotes: number
    downvotes: number
    createdAt: string
    updatedAt: string
    creator: {
        id: string,
        username: string
    }
}

export interface GetPostByIdInputDTO {
    id: string
    token: string
}

export interface DeletePostInputDTO{
    id: string
    token: string
}

export class PostDTO {
    getPostInput = (token: unknown) : GetPostInputDTO => {
        if (typeof token !== "string"){
            throw new BadRequestError ("Token inválido");
        }

        const result : GetPostInputDTO = {
            token
        }

        return result;
    }

    getPostOutput = (post: Post) : GetPostOutputDTO => {
        const result : GetPostOutputDTO = {
            id: post.getId(),
            content: post.getContent(),
            upvotes: post.getUpvotes(),
            downvotes: post.getDownvotes(),
            createdAt: post.getCreatedAt(),
            updatedAt: post.getCreatedAt(),
            creator: post.getCreator()
        }
        
        return result;
    }

    getPostByIdInput = (token: unknown, id: string) : GetPostByIdInputDTO => {
        // id é path param
        
        if (typeof token !== "string"){
            throw new BadRequestError ("Token inválido");
        }

        const result : GetPostByIdInputDTO = {
            id,
            token
        }

        return result;
    }

    createPostInput = (content: unknown, token: unknown) : CreatePostInputDTO => {
        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }

        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : CreatePostInputDTO = {
            content,
            token
        }

        return result;
    }

    editPostInput = (id : string, content : unknown, token: unknown) : EditPostInputDTO => {
        // id é string pois path param
        
        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : EditPostInputDTO = {
            id,
            content,
            token
        }

        return result;
    }

    editPostVotesInput = (id : string, upvote : unknown, token: unknown) : EditPostVotesInputDTO => {
        // id é string pois path param
        
        if (typeof upvote !== "boolean"){
            throw new BadRequestError("'upvote' deve ser um boolean");
        }
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : EditPostVotesInputDTO = {
            id,
            upvote,
            token
        }

        return result;
    }

    deletePostInput = (id: string, token: unknown) : DeletePostInputDTO => {
        // id é string pois path param
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : DeletePostInputDTO = {
            id,
            token
        }

        return result;
    }
}