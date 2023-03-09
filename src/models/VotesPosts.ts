export class VotesPosts {
    constructor(
       private userId: string,
       private postId: string,
       private upvote = 0
    ){}

    public getUserId() : string {
        return this.userId;
    }

    public setUserId(value : string) : void {
        this.userId = value;
    }

    public getPostId() : string {
        return this.postId;
    }

    public setPostId(value : string) : void {
        this.postId = value;
    }

    public getUpvote() : number {
        return this.upvote;
    }
    
    public setUpvote(value: number) : void {
        this.upvote = value;
    }
}