import { CommentDatabase } from "../database/CommentDatabase";
import { CreateCommentInputDTO } from "../dtos/CommentDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Comment } from "../models/Comment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness{
    constructor(
        private commentDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ){}

    public async createComment(input : CreateCommentInputDTO) : Promise<void>{
        const { content , token , postId } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const id = this.idGenerator.generate();
        const createdAt = (new Date()).toISOString();
        const upvotes = 0;
        const downvotes = 0;
        const newComment = new Comment (
            id,
            content,
            upvotes,
            downvotes,
            createdAt,
            createdAt,
            {
                id: payload.id,
                username: payload.username
            },
            postId
        )

        const newCommentDB = newComment.toDBModel();
        await this.commentDatabase.createComment(newCommentDB);
    }
}