import { UserBusiness } from "../../src/business/UserBusiness";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { DeleteUserInputDTO, UserDTO } from "../../src/dtos/UserDTO";

describe("deleteUserById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new UserDTO(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    test("Deleta o usuário com o id informado", async () => {
        const input : DeleteUserInputDTO = {
            id: "id-mock-normal",
            token: "token-mock-admin"
        }

        const response = await userBusiness.deleteUserById(input);

        expect(response).toBe("User deletado com sucesso");
    });

    test("Token informado não é válido", async () => {
        expect.assertions(1);

        const input : DeleteUserInputDTO = {
            id: "id-mock-normal",
            token: "invalid-token"
        }

        try {
            await userBusiness.deleteUserById(input);
        } catch (error) {
            expect(error.message).toBe("Token inválido");
        }
    });

    test("Apenas admin pode deletar user", async () => {
        expect.assertions(1);

        const input : DeleteUserInputDTO = {
            id: "id-mock-normal",
            token: "token-mock-normal"
        }

        try {
            await userBusiness.deleteUserById(input);
        } catch (error) {
            expect(error.message).toBe("Apenas admins podem deletar usuários");
        }
    });

    test("Usuário deve existir para ser deletado", async () => {
        expect.assertions(1);

        const input : DeleteUserInputDTO = {
            id: "id-not-found",
            token: "token-mock-admin"
        }

        try {
            await userBusiness.deleteUserById(input);
        } catch (error) {
            expect(error.message).toBe("Não foi encontrado um user com esse 'id'");
        }
    })
})