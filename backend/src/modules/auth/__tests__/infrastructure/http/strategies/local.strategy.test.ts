import { AuthServiceMock } from '../../../auth.service.mock';
import { LocalStrategy } from '../../../../infrastructure/http/strategies/local.strategy';

describe('Local Strategy', () => {
  let service: AuthServiceMock;
  let strategy: any;

  beforeEach(() => {
    service = new AuthServiceMock();
    strategy = new LocalStrategy(service);
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
      const mockUser = {
        id: '1',
        username: 'testuser',
        roles: [],
        role: '',
      };

      service.validateUser.mockResolvedValue(mockUser);

      const verifyFn = strategy._verify;
      const mockDone = jest.fn();
      await verifyFn('testuser', 'password123', mockDone);

      expect(service.validateUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it('should call done with false when credentials are invalid', async () => {
      service.validateUser.mockResolvedValue(null);

      const verifyFn = strategy._verify;
      const mockDone = jest.fn();
      await verifyFn('testuser', 'wrongpassword', mockDone);

      expect(service.validateUser).toHaveBeenCalledWith('testuser', 'wrongpassword');
      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Invalid credentials' });
    });

    it('should call done with error when an exception occurs', async () => {
      const mockError = new Error('Database error');
      service.validateUser.mockRejectedValue(mockError);

      const verifyFn = strategy._verify;
      const mockDone = jest.fn();
      await verifyFn('testuser', 'password123', mockDone);

      expect(mockDone).toHaveBeenCalledWith(mockError);
    });
  });
});
