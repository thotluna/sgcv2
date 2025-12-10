import { UserTokenDto } from '@sgcv2/shared';
import { LoginUseCaseService } from '../../application/login.use-case.service';
import { AuthLoginService } from '@modules/auth/domain/auth.login.service';
import { UserRepository } from '@modules/users/domain/user-repository';
import { UserEntity } from '@modules/users/domain/user-entity';
import { UserNotFoundException } from '@modules/users/domain/exceptions/user-no-found.exception';
import { InvalidPasswordException } from '@modules/auth/domain/exceptions/invalid-password.exception';
import { getUserMock, MOCK_LOGIN_REQUEST } from '../helpers';



const mockAuthLoginService: jest.Mocked<AuthLoginService> = {
    comparePassword: jest.fn(),
    generateToken: jest.fn(),
};

const mockUserRepository: jest.Mocked<UserRepository> = {
    findByUsername: jest.fn(),
};

describe('LoginUseCaseService', () => {

    let loginUseCaseService: LoginUseCaseService;
    beforeEach(() => {
        jest.clearAllMocks();
        loginUseCaseService = new LoginUseCaseService(mockUserRepository, mockAuthLoginService);
    })

    afterEach(() => {
    })
    it('should login a user correctly', async () => {

        const userFound: UserEntity = getUserMock(MOCK_LOGIN_REQUEST);
        const accessToken = 'fake-jwt-token';

        mockUserRepository.findByUsername.mockResolvedValue(userFound);
        mockAuthLoginService.comparePassword.mockResolvedValue(true);
        mockAuthLoginService.generateToken.mockResolvedValue({ access_token: accessToken });

        const result: UserTokenDto = await loginUseCaseService.execute(MOCK_LOGIN_REQUEST);

        expect(result).toBeDefined();

        // 3. Verifica el resultado esperado
        expect(result.token).toBe(accessToken);
        expect(result.user.id).toBe(userFound.id);
        expect(result.user.username).toBe(userFound.username);

        // 4. Verifica que los métodos de dependencia se llamaron correctamente
        expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST.username);
        expect(mockAuthLoginService.comparePassword).toHaveBeenCalledWith(
            MOCK_LOGIN_REQUEST.password,
            userFound.passwordHash
        );
        expect(mockAuthLoginService.generateToken).toHaveBeenCalledWith({
            id: userFound.id,
            username: userFound.username
        });
    });

    it('should login a user with user not found', async () => {

        mockUserRepository.findByUsername.mockResolvedValue(null);

        await expect(loginUseCaseService.execute(MOCK_LOGIN_REQUEST)).rejects.toThrow(UserNotFoundException);

        expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST.username);
        expect(mockAuthLoginService.comparePassword).not.toHaveBeenCalled();
        expect(mockAuthLoginService.generateToken).not.toHaveBeenCalled();

    })

    it('should login a user with invalid password', async () => {

        const userFound: UserEntity = getUserMock(MOCK_LOGIN_REQUEST);

        mockUserRepository.findByUsername.mockResolvedValue(userFound);
        mockAuthLoginService.comparePassword.mockResolvedValue(false);

        await expect(loginUseCaseService.execute(MOCK_LOGIN_REQUEST)).rejects.toThrow(InvalidPasswordException);

        expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST.username);
        expect(mockAuthLoginService.comparePassword).toHaveBeenCalledWith(
            MOCK_LOGIN_REQUEST.password,
            userFound.passwordHash
        );
        expect(mockAuthLoginService.generateToken).not.toHaveBeenCalled();

    })
});