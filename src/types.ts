export interface UserDB {
    id: string
    username: string
    email: string
    password: string
    role: USER_ROLES
    created_at: string
}

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}