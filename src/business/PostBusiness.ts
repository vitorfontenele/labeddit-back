import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO , DeletePostInputDTO , EditPostVotesInputDTO , GetPostByIdInputDTO , GetPostInputDTO , GetPostOutputDTO, GetPostVotesInputDTO, PostDTO } from "../dtos/PostDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { VotesPostsDB , UserDB , USER_ROLES, CommentDB } from "../types";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { ForbidenError } from "../errors/ForbiddenError";
import { VotesPostsDatabase } from "../database/VotesPostsDatabase";
import { VotesPosts } from "../models/VotesPosts";
import { CommentDatabase } from "../database/CommentDatabase";

export class PostBusiness {
    constructor(
        private postDatabase : PostDatabase,
        private userDatabase : UserDatabase,
        private commentDatabase: CommentDatabase,
        private votesPostsDatabase : VotesPostsDatabase,
        private postDTO: PostDTO,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getCreator(userId: string, usersDB: UserDB[]){
        const user = usersDB.find(userDB => userDB.id === userId) as UserDB;

        return {
            id: user.id,
            username: user.username
        }
    }

    public getComments(postId: string, usersDB: UserDB[], commentsDB: CommentDB[]){
        let comments = commentsDB.filter(commentDB => commentDB.post_id === postId);
            
            const commentsMainInfo = comments.map(comment => {
                const creatorData = this.getCreator(comment.creator_id, usersDB);

                return {
                    id: comment.id,
                    content: comment.content,
                    upvotes: comment.upvotes,
                    downvotes: comment.downvotes,
                    creator: {
                        id: creatorData.id,
                        username: creatorData.username 
                    }
            }})

            return commentsMainInfo;
    }

    public async getPosts(input: GetPostInputDTO) : Promise<GetPostOutputDTO[]>{
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const postsDB = await this.postDatabase.findPosts();
        const usersDB = await this.userDatabase.findUsers();
        const commentsDB = await this.commentDatabase.findComments();

        const output = postsDB.map(postDB => {
            const post = new Post (
                postDB.id,
                postDB.content,
                postDB.upvotes,
                postDB.downvotes,
                postDB.created_at,
                postDB.updated_at,
                this.getCreator(postDB.creator_id, usersDB),
                this.getComments(postDB.id, usersDB, commentsDB)
            );

            return this.postDTO.getPostOutput(post);
        })             

        return output;
    }

    public async getPostById(input: GetPostByIdInputDTO) : Promise<GetPostOutputDTO>{
        const { id , token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const postDB = await this.postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse 'id'");
        }

        const usersDB = await this.userDatabase.findUsers();
        const commentsDB = await this.commentDatabase.findComments();
        const userId = postDB.creator_id;
        const userDB = await this.userDatabase.findUserById(userId);
        const username = userDB?.username;

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.upvotes,
            postDB.downvotes,
            postDB.created_at,
            postDB.updated_at,
            { 
              id: userId, 
              username: username as string
            },
            this.getComments(postDB.id, usersDB, commentsDB)
        )

        const output = this.postDTO.getPostOutput(post);

        return output;
    }

    public async getPostsVotes(input: GetPostVotesInputDTO) {
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const postsVotesDB = await this.votesPostsDatabase.findVotesPosts();

        const output = postsVotesDB.map(postVotesDB => {
            const postVotes = new VotesPosts(
                postVotesDB.user_id, 
                postVotesDB.post_id, 
                postVotesDB.upvote
            );
            
            return this.postDTO.getPostVotesOutput(postVotes);
        });

        return output;
    }

    public async createPost(input : CreatePostInputDTO) : Promise<void>{
        const { content , token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const id = this.idGenerator.generate();
        const createdAt = (new Date()).toISOString();
        const upvotes = 0;
        const downvotes = 0;

        const newPost = new Post (
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
            []
        )

        const newPostDB = newPost.toDBModel();
        await this.postDatabase.createPost(newPostDB);
    }

    public async updatePostVotesById(input : EditPostVotesInputDTO) : Promise<void>{
        const { id , token } = input;
        const updatedVote = input.upvote;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        } 

        // user que deu upvote/downvote, não o autor do post!
        const userId = payload.id;

        const postDB = await this.postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse 'id'");
        }

        const postId = postDB.id as string;

        // No Reddit, o user pode sim dar upvote ou downvote no próprio post

        const votesPostsDB = await this.votesPostsDatabase.findVotesByUserAndPostId(userId, postId);

        let deltaUpvotes = 0;
        let deltaDownvotes = 0;

        if (!votesPostsDB){
            // Caso nao exista nem upvote nem downvote do user no post
            const newVotesPosts = new VotesPosts(userId, postId);

            if (updatedVote){
                // caso seja dado o upvote
                newVotesPosts.setUpvote(1);
                deltaUpvotes = 1;
            } else {
                // caso seja dado downvote
                newVotesPosts.setUpvote(0);
                deltaDownvotes = 1;
            }

            const newVotesPostsDB : VotesPostsDB = {
                user_id : newVotesPosts.getUserId(),
                post_id : newVotesPosts.getPostId(),
                upvote : newVotesPosts.getUpvote()
            }

            await this.votesPostsDatabase.createVote(newVotesPostsDB);
        } else {
            // Caso já exista um upvote ou downvote do user no post
            const vote = votesPostsDB.upvote;

            if ((updatedVote === Boolean(vote))){
                // Usuário dá upvote num post que já havia dado upvote
                // ou dá downvote num post que já havia dado downvote
                await this.votesPostsDatabase.deleteVoteByUserAndPostId(userId, postId);

                if (updatedVote){
                    // -1 upvote
                    deltaUpvotes = -1;
                } else {
                    // -1 downvote
                    deltaDownvotes = -1;
                }

            } else {
                // Usuário dá upvote num post que já havia dado downvote
                // ou dá downvote num post que já havia dado upvote
                const updatedVote = Number(!vote);
                const updatedVotesPosts = new VotesPosts(userId, postId, updatedVote);

                const updatedVotesPostsDB : VotesPostsDB = {
                    user_id: updatedVotesPosts.getUserId(),
                    post_id: updatedVotesPosts.getPostId(),
                    upvote: updatedVotesPosts.getUpvote()
                }

                await this.votesPostsDatabase.updateVoteByUserAndPostId(
                    updatedVotesPostsDB,
                    userId,
                    postId
                );

                deltaUpvotes = updatedVote ? 1 : -1;
                deltaDownvotes = updatedVote ? -1 : 1;
            }
        }

        const updatedPost = new Post(
            postId,
            postDB.content,
            postDB.upvotes + deltaUpvotes,
            postDB.downvotes + deltaDownvotes,
            postDB.created_at,
            postDB.updated_at,
            {
                id: postDB.creator_id,
                username: "" // não fará diferença
            },
            [] // não fará diferença
        )

        const updatedPostDB = updatedPost.toDBModel();
        await this.postDatabase.updatePostById(updatedPostDB, postId);
    }

    public async deletePostById(input: DeletePostInputDTO) : Promise<void>{
        const { id , token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }        

        const postDB = await this.postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não existe um post com esse 'id'");
        }

        // Somente admins poderão deletar posts
        if (payload.role !== USER_ROLES.ADMIN){
            throw new ForbidenError("Você não tem permissão para realizar essa ação");
        }

        const votesPostsDB = await this.votesPostsDatabase.findVotesByPostId(id);
        if (votesPostsDB.length > 0){
            await this.votesPostsDatabase.deleteVotesByPostId(id);
        }
        await this.postDatabase.deletePostById(id);
    }
}
