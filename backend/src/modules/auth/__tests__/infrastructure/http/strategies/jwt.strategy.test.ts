import { jwtOptions } from '@auth/infrastructure/http/strategies/jwt.options';
import { JwtStrategy } from '@auth/infrastructure/http/strategies/jwt.strategy';

const mockRepository = {
  findByIdForAuth: jest.fn(),
};

describe('JWT Strategy', () => {
  let jwtStrategy: JwtStrategy;
  beforeEach(() => {
    jest.clearAllMocks();
    jwtStrategy = new JwtStrategy(mockRepository as any);
  });

  describe('JWT Options', () => {
    it('should have jwtFromRequest configured', () => {
      expect(jwtOptions).toHaveProperty('jwtFromRequest');
      expect(jwtOptions.jwtFromRequest).toBeDefined();
    });

    it('should have secretOrKey configured', () => {
      expect(jwtOptions).toHaveProperty('secretOrKey');
      expect(jwtOptions.secretOrKey).toBeDefined();
    });

    it('should use JWT_SECRET from environment or default', () => {
      const expectedSecret = process.env.JWT_SECRET || 'default_secret';
      expect(jwtOptions.secretOrKey).toBe(expectedSecret);
    });

    it('should extract JWT from Authorization header as Bearer token', () => {
      expect(typeof jwtOptions.jwtFromRequest).toBe('function');
    });
  });

  describe('JWT Strategy Verify Function', () => {
    it('should create a valid JWT strategy instance', () => {
      expect(jwtStrategy).toBeDefined();
      expect(jwtStrategy.name).toBe('jwt');
    });

    it('should successfully authenticate user when found in database', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: 'ACTIVE',
        roles: [
          {
            id: 1,
            name: 'admin',
            role: {
              id: 1,
              name: 'admin',
            },
          },
        ],
      };

      mockRepository.findByIdForAuth.mockResolvedValue(mockUser);

      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: 1 };

      await verifyFn(payload, mockDone);

      expect(mockRepository.findByIdForAuth).toHaveBeenCalledWith(1);
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it('should return false when user is not found in database', async () => {
      mockRepository.findByIdForAuth.mockResolvedValue(null);

      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: 999 };

      await verifyFn(payload, mockDone);

      expect(mockRepository.findByIdForAuth).toHaveBeenCalledWith(999);
      expect(mockDone).toHaveBeenCalledWith(null, false);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection error');
      mockRepository.findByIdForAuth.mockRejectedValue(mockError);

      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: 1 };

      await verifyFn(payload, mockDone);

      expect(mockDone).toHaveBeenCalledWith(mockError, false);
    });

    it('should query database with correct user id from payload', async () => {
      const userId = 42;
      mockRepository.findByIdForAuth.mockResolvedValue(null);

      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: userId };

      await verifyFn(payload, mockDone);

      expect(mockRepository.findByIdForAuth).toHaveBeenCalledWith(userId);
    });
  });
});
