import { UserTokenDto } from '@sgcv2/shared';
import { LoginUseCaseService } from '../../application/login.use-case.service';
import { AuthLoginService } from '@modules/auth/domain/auth.login.service';
import { AuthUserNotFoundException } from '@auth/domain/exceptions/auth-user-not-found.exception';
import { UserFinderForAuth } from '@auth/domain/user-finder-for-auth';
import { AuthUser } from '@auth/domain/auth-user';
import { InvalidPasswordException } from '@modules/auth/domain/exceptions/invalid-password.exception';
import { getUserMock, MOCK_LOGIN_REQUEST } from '../helpers';

const mockAuthLoginService: jest.Mocked<AuthLoginService> = {
  comparePassword: jest.fn(),
  generateToken: jest.fn(),
};

const mockUserRepository: jest.Mocked<UserFinderForAuth> = {
  findByUsernameForAuth: jest.fn(),
};

describe('LoginUseCaseService', () => {
  let loginUseCaseService: LoginUseCaseService;
  beforeEach(() => {
    jest.clearAllMocks();
    loginUseCaseService = new LoginUseCaseService(mockUserRepository, mockAuthLoginService);
  });

  afterEach(() => { });
  it('should login a user correctly', async () => {
    // We treat the mock as AuthUser, assuming getUserMock returns compatible shape
    const userFound = getUserMock(MOCK_LOGIN_REQUEST) as unknown as AuthUser;
    const accessToken = 'fake-jwt-token';

    mockUserRepository.findByUsernameForAuth.mockResolvedValue(userFound);
    mockAuthLoginService.comparePassword.mockResolvedValue(true);
    mockAuthLoginService.generateToken.mockResolvedValue({ access_token: accessToken });

    const result: UserTokenDto = await loginUseCaseService.execute(MOCK_LOGIN_REQUEST);

    expect(result).toBeDefined();

    // 3. Verifica el resultado esperado
    expect(result.token).toBe(accessToken);
    expect(result.user.id).toBe(userFound.id);
    expect(result.user.username).toBe(userFound.username);

    // 4. Verifica que los métodos de dependencia se llamaron correctamente
    expect(mockUserRepository.findByUsernameForAuth).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST.username);
    expect(mockAuthLoginService.comparePassword).toHaveBeenCalledWith(
      MOCK_LOGIN_REQUEST.password,
      userFound.passwordHash
    );
    expect(mockAuthLoginService.generateToken).toHaveBeenCalledWith({
      id: userFound.id,
      username: userFound.username,
    });
  });

  it('should login a user with user not found', async () => {
    mockUserRepository.findByUsernameForAuth.mockResolvedValue(null);

    await expect(loginUseCaseService.execute(MOCK_LOGIN_REQUEST)).rejects.toThrow(
      AuthUserNotFoundException
    );

    expect(mockUserRepository.findByUsernameForAuth).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST.username);
    expect(mockAuthLoginService.comparePassword).not.toHaveBeenCalled();
    expect(mockAuthLoginService.generateToken).not.toHaveBeenCalled();
  });

  it('should login a user with invalid password', async () => {
    const userFound = getUserMock(MOCK_LOGIN_REQUEST) as unknown as AuthUser;

    mockUserRepository.findByUsernameForAuth.mockResolvedValue(userFound);
    mockAuthLoginService.comparePassword.mockResolvedValue(false);

    await expect(loginUseCaseService.execute(MOCK_LOGIN_REQUEST)).rejects.toThrow(
      InvalidPasswordException
    );

    expect(mockUserRepository.findByUsernameForAuth).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST.username);
    expect(mockAuthLoginService.comparePassword).toHaveBeenCalledWith(
      MOCK_LOGIN_REQUEST.password,
      userFound.passwordHash
    );
    expect(mockAuthLoginService.generateToken).not.toHaveBeenCalled();
  });
});
