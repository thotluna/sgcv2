import { AuthenticatedUserDto } from '@modules/auth/infrastructure/http/authenticated-user.dto';
import { LocalStrategy } from '../../../../infrastructure/http/strategies/local.strategy';
import { UserValidationService } from '@auth/domain/user-validation.service';

const mockValidationService: jest.Mocked<UserValidationService> = {
  validateCredentials: jest.fn(),
};

describe('Local Strategy', () => {
  let strategy: any;

  beforeEach(() => {
    strategy = new LocalStrategy(mockValidationService);
    jest.clearAllMocks();
  });

  describe('Local Strategy Configuration', () => {
    it('should create a valid local strategy instance', () => {
      expect(strategy).toBeDefined();
      expect(strategy.name).toBe('local');
    });

    it('should be configured with correct field names', () => {
      expect(strategy._usernameField).toBe('username');
      expect(strategy._passwordField).toBe('password');
    });

    it('should have a verify function', () => {
      expect(strategy._verify).toBeDefined();
      expect(typeof strategy._verify).toBe('function');
    });
  });

  describe('Local Strategy Verify Function', () => {
    it('should call done with user when credentials are valid', async () => {
      const mockUser: AuthenticatedUserDto = {
        id: 1,
        username: 'testuser',
        roles: [],
        status: 'ACTIVE',
      };

      mockValidationService.validateCredentials.mockResolvedValue(mockUser);

      const verifyFn = strategy._verify;
      const mockDone = jest.fn();
      await verifyFn('testuser', 'password123', mockDone);

      expect(mockValidationService.validateCredentials).toHaveBeenCalledWith(
        'testuser',
        'password123'
      );
      expect(mockDone).toHaveBeenCalledWith(null, {
        id: mockUser.id.toString(),
        username: mockUser.username,
        roles: mockUser.roles,
        role: mockUser.roles[0] || '',
      });
    });

    it('should call done with false when credentials are invalid', async () => {
      mockValidationService.validateCredentials.mockResolvedValue(null);

      const verifyFn = strategy._verify;
      const mockDone = jest.fn();
      await verifyFn('testuser', 'wrongpassword', mockDone);

      expect(mockValidationService.validateCredentials).toHaveBeenCalledWith(
        'testuser',
        'wrongpassword'
      );
      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Invalid credentials' });
    });

    it('should call done with error when an exception occurs', async () => {
      const mockError = new Error('Database error');
      mockValidationService.validateCredentials.mockRejectedValue(mockError);

      const verifyFn = strategy._verify;
      const mockDone = jest.fn();
      await verifyFn('testuser', 'password123', mockDone);

      expect(mockDone).toHaveBeenCalledWith(mockError);
    });
  });
});
