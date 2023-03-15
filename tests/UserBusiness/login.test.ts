import { UserBusiness } from "../../src/business/UserBusiness";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { LoginUserInputDTO, UserDTO } from "../../src/dtos/UserDTO";

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new UserDTO(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    test("Login bem-sucedido retorna token e userId", async () => {
        const input : LoginUserInputDTO = {
            email: "mocknormal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.loginUser(input);

        expect(response.token).toBe("token-mock-normal");
        expect(response.userId).toBe("id-mock-normal");
    })

    test("Email não encontrado", async () => {
        expect.assertions(1);

        const input : LoginUserInputDTO = {
            email: "notfound@email.com",
            password: "bananinha"
        }

        try {
            await userBusiness.loginUser(input);
        } catch (error) {
            expect(error.message).toBe("'email' não encontrado");
        }
    })

    test("Senha incorreta", async () => {
        expect.assertions(1);

        const input : LoginUserInputDTO = {
            email: "mocknormal@email.com",
            password: "not-bananinha"
        }

        try {
            await userBusiness.loginUser(input);
        } catch (error) {
            expect(error.message).toBe("'email' ou 'password' incorretos");
        }
    })
})