// Mock AuthService before importing the strategy
const mockValidateUser = jest.fn();

jest.mock('../auth.service', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => {
      return {
        validateUser: mockValidateUser,
      };
    }),
  };
});

describe('Local Strategy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Local Strategy Configuration', () => {
    it('should create a valid local strategy instance', async () => {
      const { localStrategy } = await import('../strategies/local.strategy');

      expect(localStrategy).toBeDefined();
      expect(localStrategy.name).toBe('local');
    });

    it('should be configured with correct field names', async () => {
      const { localStrategy } = await import('../strategies/local.strategy');

      expect((localStrategy as any)._usernameField).toBe('username');
      expect((localStrategy as any)._passwordField).toBe('password');
    });

    it('should have a verify function', async () => {
      const { localStrategy } = await import('../strategies/local.strategy');

      expect((localStrategy as any)._verify).toBeDefined();
      expect(typeof (localStrategy as any)._verify).toBe('function');
    });
  });

  describe('Local Strategy Verify Function', () => {
    it('should call done with user when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed',
        firstName: 'Test',
        lastName: 'User',
        isActive: 'ACTIVE' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockValidateUser.mockResolvedValue(mockUser);

      const { localStrategy } = await import('../strategies/local.strategy');
      const verifyFn = (localStrategy as any)._verify;

      const mockDone = jest.fn();
      await verifyFn('testuser', 'password123', mockDone);

      expect(mockValidateUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it('should call done with false when credentials are invalid', async () => {
      mockValidateUser.mockResolvedValue(null);

      const { localStrategy } = await import('../strategies/local.strategy');
      const verifyFn = (localStrategy as any)._verify;

      const mockDone = jest.fn();
      await verifyFn('testuser', 'wrongpassword', mockDone);

      expect(mockValidateUser).toHaveBeenCalledWith('testuser', 'wrongpassword');
      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Invalid credentials' });
    });

    it('should call done with error when an exception occurs', async () => {
      const mockError = new Error('Database error');
      mockValidateUser.mockRejectedValue(mockError);

      const { localStrategy } = await import('../strategies/local.strategy');
      const verifyFn = (localStrategy as any)._verify;

      const mockDone = jest.fn();
      await verifyFn('testuser', 'password123', mockDone);

      expect(mockDone).toHaveBeenCalledWith(mockError);
    });
  });
});
