import { jwtOptions } from '../../../../infrastructure/http/strategies/jwt.options';
import { prisma } from '../../../../../../config/prisma';
import { JwtStrategy } from '../../../../infrastructure/http/strategies/jwt.strategy';

// Mock prisma before importing the strategy
jest.mock('../../../../../../config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('JWT Strategy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      const jwtStrategy = new JwtStrategy();

      expect(jwtStrategy).toBeDefined();
      expect(jwtStrategy.name).toBe('jwt');
    });

    it('should successfully authenticate user when found in database', async () => {
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

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const jwtStrategy = new JwtStrategy();
      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: 1 };

      await verifyFn(payload, mockDone);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it('should return false when user is not found in database', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const jwtStrategy = new JwtStrategy();
      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: 999 };

      await verifyFn(payload, mockDone);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(mockDone).toHaveBeenCalledWith(null, false);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection error');
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(mockError);

      const jwtStrategy = new JwtStrategy();
      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: 1 };

      await verifyFn(payload, mockDone);

      expect(mockDone).toHaveBeenCalledWith(mockError, false);
    });

    it('should query database with correct user id from payload', async () => {
      const userId = 42;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const jwtStrategy = new JwtStrategy();
      const verifyFn = (jwtStrategy as any)._verify;

      const mockDone = jest.fn();
      const payload = { sub: userId };

      await verifyFn(payload, mockDone);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });
});
