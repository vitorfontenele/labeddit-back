import { VotesPostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VotesPostsDatabase extends BaseDatabase {
    public static TABLE_VOTES_POSTS = "votes_posts"

    public async findVotesByUserAndPostId(user_id : string, post_id : string){
        const [ result ] : VotesPostsDB[] | undefined[] = await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POSTS)
            .where({user_id, post_id});
        
        return result;
    }

    public async findVotesByPostId(post_id: string){
        const result : VotesPostsDB[] = await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POSTS)
            .where({post_id});
            
        return result;
    }

    public async createVote(newVoteDB : VotesPostsDB){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POSTS)
            .insert(newVoteDB);
    }

    public async updateVoteByUserAndPostId(updatedVoteDB : VotesPostsDB, user_id: string, post_id: string){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POSTS)
            .update(updatedVoteDB)
            .where({user_id, post_id});
    }

    public async deleteVoteByUserAndPostId(user_id: string, post_id: string){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POSTS)
            .del()
            .where({user_id, post_id});
    }

    public async deleteVotesByPostId(post_id: string){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POSTS)
            .del()
            .where({post_id});
    }
}