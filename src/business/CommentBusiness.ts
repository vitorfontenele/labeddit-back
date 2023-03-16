import { CommentDatabase } from "../database/CommentDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CommentVotesDatabase } from "../database/CommentVotesDatabase";
import { CommentDTO, CreateCommentInputDTO, EditCommentVoteInputDTO, GetCommentInputDTO, GetCommentOutputDTO, GetCommentVoteInputDTO } from "../dtos/CommentDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
import { CommentVote } from "../models/CommentVote";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { UserDB, CommentVoteDB } from "../types";

export class CommentBusiness{
    constructor(
        private commentDatabase: CommentDatabase,
        private userDatabase: UserDatabase,
        private commentVotesDatabase: CommentVotesDatabase,
        private commentDTO: CommentDTO,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ){}

    public async getComments(input : GetCommentInputDTO) : Promise<GetCommentOutputDTO[]>{
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const usersDB = await this.userDatabase.findUsers();
        const commentsDB = await this.commentDatabase.findComments();

        const output = commentsDB.map(commentDB => {
            const comment = new Comment(
                commentDB.id,
                commentDB.content,
                commentDB.upvotes,
                commentDB.downvotes,
                commentDB.created_at,
                commentDB.updated_at,
                getCreator(commentDB.creator_id),
                commentDB.post_id
            );

            return this.commentDTO.getCommentOutput(comment);
        })

        function getCreator(userId : string){
            const user = usersDB.find(userDB => userDB.id === userId) as UserDB;

            return {
                id: user.id,
                username: user.username
            }
        }

        return output;
    }

    public async getCommentVotes(input: GetCommentVoteInputDTO) {
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const commentVotesDB = await this.commentVotesDatabase.findCommentVotes();

        const output = commentVotesDB.map(commentVoteDB => {
            const commentVote = new CommentVote(
                commentVoteDB.comment_id,
                commentVoteDB.user_id,
                commentVoteDB.vote
            );

            return this.commentDTO.getCommentVoteOutput(commentVote);
        });

        return output;
    }

    public async createComment(input : CreateCommentInputDTO) : Promise<string>{
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

        const output = "Comment criado com sucesso";
        return output;
    }

    public async updateCommentVoteById(input: EditCommentVoteInputDTO) : Promise<string>{
        const { id , token } = input;
        const updatedVote = input.vote;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        } 

        // user que deu upvote/downvote, não o autor do comment!
        const userId = payload.id;

        const commentDB = await this.commentDatabase.findCommentById(id);
        if (!commentDB){
            throw new NotFoundError("Não foi encontrado um comment com esse 'id'");
        }

        const commentId = commentDB.id as string;

        // No Reddit, o user pode sim dar upvote ou downvote no próprio comentário

        const commentVoteDB = await this.commentVotesDatabase.findVoteByUserAndCommentId(userId, commentId);

        let deltaUpvotes = 0;
        let deltaDownvotes = 0;

        if (!commentVoteDB){
            // Caso não exista nem upvote nem downvote do usuário no comment
            const newCommentVote = new CommentVote(commentId, userId);

            if (updatedVote){
                // caso seja dado o upvote
                newCommentVote.setVote(1);
                deltaUpvotes = 1;
            } else {
                // caso seja dado o downvote
                newCommentVote.setVote(0);
                deltaDownvotes = 1;
            }

            const newCommentVoteDB : CommentVoteDB = {
                user_id: newCommentVote.getUserId(),
                comment_id: newCommentVote.getCommentId(),
                vote: newCommentVote.getVote()
            }

            await this.commentVotesDatabase.createVote(newCommentVoteDB);
        } else {
            // Caso já exista um upvote ou downvote do user no comment
            const vote = commentVoteDB.vote;

            if ((updatedVote === Boolean(vote))){
                // Usuário dá upvote num comment que já havia dado upvote
                // ou dá downvote num comment que já havia dado downvote
                await this.commentVotesDatabase.deleteVoteByUserAndCommentId(userId, commentId);

                if (updatedVote){
                    // -1 upvote
                    deltaUpvotes = -1;
                } else {
                    // -1 downvote
                    deltaDownvotes = -1;
                }
            } else {
                // Usuário dá upvote num comment que já havia dado downvote
                // ou dá downvote num comment que já havia dado upvote
                const updatedVote = Number(!vote);
                const updatedCommentVote = new CommentVote(userId, commentId, updatedVote);

                const updatedCommentVoteDB : CommentVoteDB = {
                    user_id: updatedCommentVote.getUserId(),
                    comment_id: updatedCommentVote.getCommentId(),
                    vote: updatedCommentVote.getVote()
                }

                await this.commentVotesDatabase.updateVoteByUserAndCommentId(
                    updatedCommentVoteDB,
                    userId,
                    commentId
                )

                deltaUpvotes = updatedVote ? 1 : -1;
                deltaDownvotes = updatedVote ? -1 : 1;
            }
        }

        const updatedComment = new Comment(
            commentId,
            commentDB.content,
            commentDB.upvotes + deltaUpvotes,
            commentDB.downvotes + deltaDownvotes,
            commentDB.created_at,
            commentDB.updated_at,
            {
                id: commentDB.creator_id,
                username: "" // não fará diferença
            },
            commentDB.post_id
        )

        const updatedCommentDB = updatedComment.toDBModel();
        await this.commentDatabase.updateCommentById(updatedCommentDB, commentId);

        const output = "Vote do comment atualizado com sucesso";
        return output;
    }
}