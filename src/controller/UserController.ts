import { Request , Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserDTO } from "../dtos/UserDTO";
import { BaseError } from "../errors/BaseError";

export class UserController {
    constructor(
        private userBusiness : UserBusiness,
        private userDTO : UserDTO
    ){}
    
    public getUsers = async(req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;

            const input = this.userDTO.getUserInput(token);
            const output = await this.userBusiness.getUsers(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public getUserById = async(req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const token = req.headers.authorization;

            const input = this.userDTO.getUserInputById(token, id);
            const output = await this.userBusiness.getUserById(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createUser = async(req: Request, res: Response) => {
        try {
            const { name , email , password } = req.body;

            const input = this.userDTO.createUserInput(name, email, password);
            const output = await this.userBusiness.createUser(input);

            res.status(201).send(output);
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public loginUser = async(req: Request, res: Response) => {
        try {
            const { email , password } = req.body;

            const input = this.userDTO.loginUserInput(email, password);
            const output = await this.userBusiness.loginUser(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}