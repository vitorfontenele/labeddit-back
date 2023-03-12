import { BaseDatabase } from "./BaseDatabase";
import { CommentDB } from "../types";

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments";

    public async findComments(){
        const result : CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS);
        return result;
    }

    public async createComment(newCommentDB : CommentDB){
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(newCommentDB);
    }
}