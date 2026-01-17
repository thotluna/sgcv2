import 'reflect-metadata';
import { AuthService } from '@modules/auth/infrastructure/http/auth.service';
import { UserCredentialsRepository } from '@modules/auth/domain/user-credentials.repository';
import { AuthUser } from '@modules/auth/domain/auth-user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserCredentialsRepository: jest.Mocked<UserCredentialsRepository>;

  const mockUser: AuthUser = {
    id: 1,
    username: 'testuser',
    passwordHash: 'hashed_password',
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    status: 'ACTIVE',
    roles: ['admin'],
    permissions: [],
  };

  beforeEach(() => {
    mockUserCredentialsRepository = {
      findByUsernameForAuth: jest.fn(),
    };
    authService = new AuthService(mockUserCredentialsRepository);
    jest.clearAllMocks();
  });

  describe('validateCredentials', () => {
    it('should return null if user is not found', async () => {
      mockUserCredentialsRepository.findByUsernameForAuth.mockResolvedValue(null);

      const result = await authService.validateCredentials('unknown', 'password');

      expect(result).toBeNull();
      expect(mockUserCredentialsRepository.findByUsernameForAuth).toHaveBeenCalledWith('unknown');
    });

    it('should return null if password does not match', async () => {
      mockUserCredentialsRepository.findByUsernameForAuth.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateCredentials('testuser', 'wrongWrong');

      expect(result).toBeNull();
      expect(mockUserCredentialsRepository.findByUsernameForAuth).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongWrong', 'hashed_password');
    });

    it('should return user if credentials are valid', async () => {
      mockUserCredentialsRepository.findByUsernameForAuth.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateCredentials('testuser', 'password');

      expect(result).toEqual(mockUser);
      expect(mockUserCredentialsRepository.findByUsernameForAuth).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_password');
    });
  });

  describe('comparePassword', () => {
    it('should call bcrypt.compare with correct arguments', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await authService.comparePassword('pass', 'hash');
      expect(bcrypt.compare).toHaveBeenCalledWith('pass', 'hash');
      expect(result).toBe(true);
    });
  });

  describe('generateToken', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV, JWT_SECRET: 'test_secret' };
    });

    afterAll(() => {
      process.env = OLD_ENV;
    });

    it('should generate a token using jwt.sign', () => {
      const payload = { sub: 1 };
      const expectedToken = 'signed_token';
      (jwt.sign as jest.Mock).mockReturnValue(expectedToken);

      const token = authService.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test_secret', { expiresIn: '1d' });
      expect(token).toBe(expectedToken);
    });
  });
});
