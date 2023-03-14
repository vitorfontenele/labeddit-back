import { VotesCommentsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VotesCommentsDatabase extends BaseDatabase {
    public static TABLE_VOTES_COMMENTS = "votes_comments";

    public async findVotesByUserAndCommentId(user_id: string, comment_id: string){
        const [ result ] : VotesCommentsDB[] | undefined[] = await BaseDatabase
            .connection(VotesCommentsDatabase.TABLE_VOTES_COMMENTS)
            .where({user_id, comment_id});
        
        return result;
    }

    public async findVotesComments(){
        const result : VotesCommentsDB[] = await BaseDatabase
            .connection(VotesCommentsDatabase.TABLE_VOTES_COMMENTS);
        return result;
    }

    public async createVote(newVoteDB : VotesCommentsDB ){
        await BaseDatabase
            .connection(VotesCommentsDatabase.TABLE_VOTES_COMMENTS)
            .insert(newVoteDB);
    }

    public async updateVoteByUserAndCommentId(updatedVoteDB: VotesCommentsDB, user_id: string, comment_id: string){
        await BaseDatabase
            .connection(VotesCommentsDatabase.TABLE_VOTES_COMMENTS)
            .update(updatedVoteDB)
            .where({user_id, comment_id});
    }

    public async deleteVoteByUserAndCommentId(user_id: string, comment_id: string){
        await BaseDatabase
            .connection(VotesCommentsDatabase.TABLE_VOTES_COMMENTS)
            .del()
            .where({user_id, comment_id});
    }
}