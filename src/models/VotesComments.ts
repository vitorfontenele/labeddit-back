export class VotesComments {
    constructor(
        private commentId: string,
        private userId: string,
        private upvote = 0
    ){}

    public getUserId() : string {
        return this.userId;
    }

    public setUserId(value : string) : void {
        this.userId = value;
    }

    public getCommentId() : string {
        return this.commentId;
    }

    public setCommentId(value : string) : void {
        this.commentId = value;
    }

    public getUpvote() : number {
        return this.upvote;
    }

    public setUpvote(value: number) : void {
        this.upvote = value;
    }
}