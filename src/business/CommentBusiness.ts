import { CommentDatabase } from "../database/CommentDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { VotesCommentsDatabase } from "../database/VotesCommentsDatabase";
import { CommentDTO, CreateCommentInputDTO, EditCommentVotesInputDTO, GetCommentInputDTO, GetCommentOutputDTO } from "../dtos/CommentDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
import { VotesComments } from "../models/VotesComments";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { UserDB, VotesCommentsDB } from "../types";

export class CommentBusiness{
    constructor(
        private commentDatabase: CommentDatabase,
        private userDatabase: UserDatabase,
        private votesCommentsDatabase: VotesCommentsDatabase,
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

    public async updateCommentVotesById(input: EditCommentVotesInputDTO) : Promise<void>{
        const { id , token } = input;
        const updatedVote = input.upvote;

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

        const votesCommentsDB = await this.votesCommentsDatabase.findVotesByUserAndCommentId(userId, commentId);

        let deltaUpvotes = 0;
        let deltaDownvotes = 0;

        if (!votesCommentsDB){
            // Caso não exista nem upvote nem downvote do usuário no comment
            const newVotesComments = new VotesComments(commentId, userId);

            if (updatedVote){
                // caso seja dado o upvote
                newVotesComments.setUpvote(1);
                deltaUpvotes = 1;
            } else {
                // caso seja dado o downvote
                newVotesComments.setUpvote(0);
                deltaDownvotes = 1;
            }

            const newVotesCommentsDB : VotesCommentsDB = {
                user_id: newVotesComments.getUserId(),
                comment_id: newVotesComments.getCommentId(),
                upvote: newVotesComments.getUpvote()
            }

            await this.votesCommentsDatabase.createVote(newVotesCommentsDB);
        } else {
            // Caso já exista um upvote ou downvote do user no comment
            const vote = votesCommentsDB.upvote;

            if ((updatedVote === Boolean(vote))){
                // Usuário dá upvote num comment que já havia dado upvote
                // ou dá downvote num comment que já havia dado downvote
                await this.votesCommentsDatabase.deleteVoteByUserAndCommentId(userId, commentId);

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
                const updatedVotesComments = new VotesComments(userId, commentId, updatedVote);

                const updatedVotesCommentsDB : VotesCommentsDB = {
                    user_id: updatedVotesComments.getUserId(),
                    comment_id: updatedVotesComments.getCommentId(),
                    upvote: updatedVotesComments.getUpvote()
                }

                await this.votesCommentsDatabase.updateVoteByUserAndCommentId(
                    updatedVotesCommentsDB,
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
    }
}