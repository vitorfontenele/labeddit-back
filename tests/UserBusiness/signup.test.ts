import { UserBusiness } from "../../src/business/UserBusiness";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { UserDTO } from "../../src/dtos/UserDTO";
import { CreateUserInputDTO } from "../../src/dtos/UserDTO";

describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new UserDTO(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    test("Cadastrado bem-sucedido retorna token e userId", async () => {
        const input : CreateUserInputDTO = {
            email: "example@email.com",
            username: "example",
            password: "bananinha",
            receiveEmails: false
        }

        const response = await userBusiness.createUser(input);

        expect(response.token).toBe("token-mock-normal");
        expect(response.userId).toBe("id-mock");
    })

    test("Username repetido", async () => {
        expect.assertions(1);

        const input : CreateUserInputDTO = {
            email: "example@email.com",
            username: "mocknormal",
            password: "bananinha",
            receiveEmails: false
        }

        try {
            await userBusiness.createUser(input);
        } catch (error) {
            expect(error.message).toBe("Já existe um user com esse 'username'")
        }
    })

    test("Email repetido", async () => {
        expect.assertions(1);

        const input : CreateUserInputDTO = {
            email: "mocknormal@email.com",
            username: "example",
            password: "bananinha",
            receiveEmails: false
        }

        try {
            await userBusiness.createUser(input);
        } catch (error) {
            expect(error.message).toBe("Já existe um user com esse 'email'");
        }

    })
})