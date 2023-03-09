export interface UserDB {
    id: string
    username: string
    email: string
    password: string
    role: USER_ROLES
    created_at: string
}

export interface PostDB {
    id: string
    creator_id: string
    content: string
    upvotes: number
    downvotes: number
    created_at: string
    updated_at: string
}

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}