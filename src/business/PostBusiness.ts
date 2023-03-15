import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO , DeletePostInputDTO , EditPostInputDTO, EditPostVoteInputDTO , GetPostByIdInputDTO , GetPostInputDTO , GetPostOutputDTO, GetPostVoteInputDTO, PostDTO } from "../dtos/PostDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { PostVoteDB , UserDB , USER_ROLES, CommentDB } from "../types";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { ForbidenError } from "../errors/ForbiddenError";
import { PostVotesDatabase } from "../database/PostVotesDatabase";
import { PostVote } from "../models/PostVote";
import { CommentDatabase } from "../database/CommentDatabase";

export class PostBusiness {
    constructor(
        private postDatabase : PostDatabase,
        private userDatabase : UserDatabase,
        private commentDatabase: CommentDatabase,
        private postVotesDatabase : PostVotesDatabase,
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

    public async getPostVotes(input: GetPostVoteInputDTO) {
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const postVotesDB = await this.postVotesDatabase.findPostVotes();

        const output = postVotesDB.map(postVoteDB => {
            const postVote = new PostVote(
                postVoteDB.user_id, 
                postVoteDB.post_id, 
                postVoteDB.vote
            );
            
            return this.postDTO.getPostVoteOutput(postVote);
        });

        return output;
    }

    public async createPost(input : CreatePostInputDTO) : Promise<string>{
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

        const output = "Post criado com sucesso";
        
        return output;
    }

    public async updatePostById(input : EditPostInputDTO) : Promise<string>{
        const { content , id , token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

        const postDB = await this.postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse id");
        }

        if (payload.role !== USER_ROLES.ADMIN){
            throw new ForbidenError("Somente admins podem editar posts");
        }

        const updatedAt = (new Date()).toISOString();

        const updatedPost = new Post(
            id,
            content,
            postDB.upvotes,
            postDB.downvotes,
            postDB.created_at,
            updatedAt,
            {
                id: postDB.creator_id,
                username: "" // não fará diferença
            },
            [] // não fará diferença
        )

        const updatedPostDB = updatedPost.toDBModel();
        await this.postDatabase.updatePostById(updatedPostDB, id);

        const output = "Post atualizado com sucesso";

        return output;
    }

    public async updatePostVoteById(input : EditPostVoteInputDTO) : Promise<string>{
        const { id , token } = input;
        const updatedVote = input.vote;

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

        const postVoteDB = await this.postVotesDatabase.findVoteByUserAndPostId(userId, postId);

        let deltaUpvotes = 0;
        let deltaDownvotes = 0;

        if (!postVoteDB){
            // Caso nao exista nem upvote nem downvote do user no post
            const newPostVote = new PostVote(userId, postId);

            if (updatedVote){
                // caso seja dado o upvote
                newPostVote.setVote(1);
                deltaUpvotes = 1;
            } else {
                // caso seja dado downvote
                newPostVote.setVote(0);
                deltaDownvotes = 1;
            }

            const newPostVoteDB : PostVoteDB = {
                user_id : newPostVote.getUserId(),
                post_id : newPostVote.getPostId(),
                vote : newPostVote.getVote()
            }

            await this.postVotesDatabase.createVote(newPostVoteDB);
        } else {
            // Caso já exista um upvote ou downvote do user no post
            const vote = postVoteDB.vote;

            if ((updatedVote === Boolean(vote))){
                // Usuário dá upvote num post que já havia dado upvote
                // ou dá downvote num post que já havia dado downvote
                await this.postVotesDatabase.deleteVoteByUserAndPostId(userId, postId);

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
                const updatedPostVote = new PostVote(userId, postId, updatedVote);

                const updatedPostVoteDB : PostVoteDB = {
                    user_id: updatedPostVote.getUserId(),
                    post_id: updatedPostVote.getPostId(),
                    vote: updatedPostVote.getVote()
                }

                await this.postVotesDatabase.updateVoteByUserAndPostId(
                    updatedPostVoteDB,
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

        const output = "Vote atualizado com sucesso";
        return output;
    }

    public async deletePostById(input: DeletePostInputDTO) : Promise<string>{
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

        await this.postDatabase.deletePostById(id);

        const output = "Post deletado com sucesso";

        return output;
    }
}
