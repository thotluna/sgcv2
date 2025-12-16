import { AuthController } from '@modules/auth/infrastructure/http/auth.controller';
import { AuthUserNotFoundException } from '@auth/domain/exceptions/auth-user-not-found.exception';
import { InvalidPasswordException } from '@modules/auth/domain/exceptions/invalid-password.exception';
import { MOCK_LOGIN_REQUEST, MOCK_USER_TOKEN_DTO } from '../../helpers';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { LoginUseCaseService } from '@modules/auth/application/login.use-case.service';

const mockLoginUseCaseService = {
  execute: jest.fn(),
} as unknown as jest.Mocked<LoginUseCaseService>;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
} as any;

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    authController = new AuthController(mockLoginUseCaseService);
  });

  it('should call LoginUseCaseService and return success DTO', async () => {
    mockLoginUseCaseService.execute.mockResolvedValue(MOCK_USER_TOKEN_DTO);

    const req = { body: MOCK_LOGIN_REQUEST } as any;

    await authController.login(req, mockResponse);

    expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: { user: MOCK_USER_TOKEN_DTO.user },
      })
    );
  });

  it('should throw NotFoundException when user not found', async () => {
    mockLoginUseCaseService.execute.mockRejectedValue(new AuthUserNotFoundException('admin'));

    const req = { body: MOCK_LOGIN_REQUEST } as any;

    await expect(authController.login(req, mockResponse)).rejects.toThrow(NotFoundException);

    expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);
  });

  it('should throw UnauthorizedException when password invalid', async () => {
    mockLoginUseCaseService.execute.mockRejectedValue(new InvalidPasswordException());

    const req = { body: MOCK_LOGIN_REQUEST } as any;

    await expect(authController.login(req, mockResponse)).rejects.toThrow(UnauthorizedException);

    expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);
  });

  it('should rethrow generic Error', async () => {
    const genericError = new Error('Database connection failed');
    mockLoginUseCaseService.execute.mockRejectedValue(genericError);

    const req = { body: MOCK_LOGIN_REQUEST } as any;

    await expect(authController.login(req, mockResponse)).rejects.toThrow(Error);
    await expect(authController.login(req, mockResponse)).rejects.toThrow(
      'Database connection failed'
    );

    expect(mockLoginUseCaseService.execute).toHaveBeenCalledWith(MOCK_LOGIN_REQUEST);
  });
});
