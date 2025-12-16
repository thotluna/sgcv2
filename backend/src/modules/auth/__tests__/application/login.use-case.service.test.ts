import { LoginUseCaseService } from '../../application/login.use-case.service';
import { AuthUser } from '@auth/domain/auth-user';
import { InvalidPasswordException } from '@modules/auth/domain/exceptions/invalid-password.exception';
import { getUserMock, MOCK_LOGIN_REQUEST } from '../helpers';
import { LoginService } from '@modules/auth/domain/login.service';

const mockAuthLoginService: jest.Mocked<LoginService> = {
  validateCredentials: jest.fn(),
  generateToken: jest.fn(),
};

describe('LoginUseCaseService', () => {
  let loginUseCaseService: LoginUseCaseService;
  beforeEach(() => {
    jest.clearAllMocks();
    loginUseCaseService = new LoginUseCaseService(mockAuthLoginService);
  });

  afterEach(() => {});
  it('should login a user correctly', async () => {
    const userFound = getUserMock(MOCK_LOGIN_REQUEST) as unknown as AuthUser;
    const accessToken = 'fake-jwt-token';

    mockAuthLoginService.validateCredentials.mockResolvedValue(userFound);
    mockAuthLoginService.generateToken.mockReturnValue(accessToken);

    const result = await loginUseCaseService.execute(MOCK_LOGIN_REQUEST);

    expect(result).toBeDefined();

    expect(result.token).toBe(accessToken);
    expect(result.user.id).toBe(userFound.id);
    expect(result.user.username).toBe(userFound.username);

    expect(mockAuthLoginService.validateCredentials).toHaveBeenCalledWith(
      MOCK_LOGIN_REQUEST.username,
      MOCK_LOGIN_REQUEST.password
    );
    expect(mockAuthLoginService.generateToken).toHaveBeenCalledWith({
      username: userFound.username,
      roles: userFound.roles,
      sub: userFound.id,
    });
  });

  it('should throw InvalidPasswordException when credentials are invalid', async () => {
    mockAuthLoginService.validateCredentials.mockResolvedValue(null);

    await expect(loginUseCaseService.execute(MOCK_LOGIN_REQUEST)).rejects.toThrow(
      InvalidPasswordException
    );

    expect(mockAuthLoginService.validateCredentials).toHaveBeenCalledWith(
      MOCK_LOGIN_REQUEST.username,
      MOCK_LOGIN_REQUEST.password
    );
    expect(mockAuthLoginService.generateToken).not.toHaveBeenCalled();
  });
});
