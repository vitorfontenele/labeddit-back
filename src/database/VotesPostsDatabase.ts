import { VotesPostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VotesPostsDatabase extends BaseDatabase {
    public static TABLE_VOTES_POST = "votes_posts"

    public async findVoteByUserAndPostId(user_id : string, post_id : string){
        const [ result ] : VotesPostsDB[] | undefined[] = await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POST)
            .where({user_id, post_id});
        
        return result;
    }

    public async findVoteByPostId(post_id: string){
        const result : VotesPostsDB[] = await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POST)
            .where({post_id});
    }

    public async createVote(newVoteDB : VotesPostsDB){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POST)
            .insert(newVoteDB);
    }

    public async updateVoteByUserAndPostId(updatedVoteDB : VotesPostsDB, user_id: string, post_id: string){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POST)
            .update(updatedVoteDB)
            .where({user_id, post_id});
    }

    public async deleteVoteByUserAndPostId(user_id: string, post_id: string){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POST)
            .del()
            .where({user_id, post_id});
    }

    public async deleteVotesByPostId(post_id: string){
        await BaseDatabase
            .connection(VotesPostsDatabase.TABLE_VOTES_POST)
            .del()
            .where({post_id});
    }
}