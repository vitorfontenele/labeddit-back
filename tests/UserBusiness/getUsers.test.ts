import { UserBusiness } from "../../src/business/UserBusiness";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { GetUserInputDTO, UserDTO } from "../../src/dtos/UserDTO";
import { USER_ROLES } from "../../src/types";

describe("getUsers", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new UserDTO(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    test("Retorna lista de usuários", async () => {
        const input : GetUserInputDTO = {
            token: "token-mock-normal"
        }

        const response = await userBusiness.getUsers(input);

        expect(response).toHaveLength(2);
        expect(response).toContainEqual({
            id: "id-mock-normal",
            username: "mocknormal",
            role: USER_ROLES.NORMAL
        });
    })

    test("Token não é válido", async () => {
        expect.assertions(1);

        const input : GetUserInputDTO = {
            token: "invalid-token"
        }   

        try {
            await userBusiness.getUsers(input);
        } catch (error) {
            expect(error.message).toBe("Token inválido");
        }
    })
})