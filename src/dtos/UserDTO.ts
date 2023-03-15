import { BadRequestError } from "../errors/BadRequestError";
import { emailRegex, passwordRegex } from "../regex";
import { User } from "../models/User";
import { USER_ROLES } from "../types";

export interface CreateUserInputDTO {
    username: string
    email: string
    password: string
    receiveEmails: number
}

export interface CreateUserOutputDTO {
    token: string
    userId: string
}

export interface GetUserInputDTO {
    token: string
}


export interface GetUserOutputDTO {
    id: string
    username: string
    role: USER_ROLES
}

export interface GetUserByIdInputDTO {
    id: string 
    token: string
}

export interface LoginUserInputDTO {
    email: string
    password: string
}

export interface LoginUserOutputDTO {
    token: string
    userId: string
}

export class UserDTO {
    getUserInput(token : unknown){
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : GetUserInputDTO = {
            token
        }

        return result;
    }

    getUserOutput(user: User) : GetUserOutputDTO {
        const result : GetUserOutputDTO = {
            id: user.getId(),
            username: user.getUsername(),
            role: user.getRole()
        }

        return result;
    }

    getUserInputById(token: unknown, id: string){
        // id é path param

        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : GetUserByIdInputDTO = {
            id,
            token
        }

        return result;
    }

    createUserInput(username: unknown, email: unknown, password: unknown, receiveEmails: number) : CreateUserInputDTO{
        if (typeof username !== "string"){
            throw new BadRequestError("'username' precisa ser uma string");
        }

        if (username.length < 2){
            throw new BadRequestError("'username' precisa ter no mínimo 2 caracteres");
        }

        if (typeof email !== "string"){
            throw new BadRequestError("'email' precisa ser uma string");
        }

        if (!emailRegex.test(email)){
            throw new BadRequestError("'email' não está no formato adequado");
        }

        if (typeof password !== "string"){
            throw new BadRequestError("'password' precisa ser uma string");
        }

        if (typeof receiveEmails !== "number"){
            throw new BadRequestError("'receiveEmails' precisa ser um number");
        }

        const result : CreateUserInputDTO = {
            username,
            email,
            password,
            receiveEmails
        }

        return result;
    }

    createUserOutput(token : string, userId: string) : CreateUserOutputDTO {
        const result : CreateUserOutputDTO = {
            token,
            userId
        }

        return result;
    }

    loginUserInput(email: unknown, password: unknown) : LoginUserInputDTO {
        if (typeof email !== "string"){
            throw new BadRequestError("'email' deve ser string");
        }

        if (typeof password !== "string"){
            throw new BadRequestError("'password' deve ser string");
        }

        const result : LoginUserInputDTO = {
            email,
            password
        }

        return result;
    }

    loginUserOutput(token : string, userId: string) : LoginUserOutputDTO{
        const result : LoginUserOutputDTO = {
            token,
            userId
        }

        return result;
    }
}