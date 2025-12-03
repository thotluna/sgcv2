import { AuthController } from '../auth.controller';
import { AuthServiceMock } from './auth.service.mock';

describe('AuthController', () => {
  let service: AuthServiceMock;
  let authController: AuthController;

  beforeEach(() => {
    service = new AuthServiceMock();
    authController = new AuthController(service);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 when username is missing', async () => {
      const req = { body: { password: 'test123' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'BAD_REQUEST',
            message: 'Username and password are required',
          }),
        })
      );
    });

    it('should return 400 when password is missing', async () => {
      const req = { body: { username: 'admin' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'BAD_REQUEST',
            message: 'Username and password are required',
          }),
        })
      );
    });

    it('should return 401 when credentials are invalid', async () => {
      service.validateUser.mockResolvedValue(null);

      const req = { body: { username: 'admin', password: 'wrong' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials',
          }),
        })
      );
      expect(service.validateUser).toHaveBeenCalledWith('admin', 'wrong');
    });

    it('should return 200 with token when credentials are valid', async () => {
      const fakeUser = { id: 1, username: 'admin' };
      service.validateUser.mockResolvedValue(fakeUser);
      service.login.mockResolvedValue({ access_token: 'jwt-token' });

      const req = { body: { username: 'admin', password: 'admin123' } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            user: { id: 1, username: 'admin' },
            token: 'jwt-token',
          },
        })
      );
      expect(service.validateUser).toHaveBeenCalledWith('admin', 'admin123');
      expect(service.login).toHaveBeenCalledWith({
        id: 1,
        username: 'admin',
      });
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      const req = {} as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.logout(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            message: 'Logout successful',
            note: 'Client should remove the token from storage',
          },
        })
      );
    });
  });

  describe('me', () => {
    it('should return 401 when user is not authenticated', async () => {
      const req = { user: undefined } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized',
          }),
        })
      );
    });

    it('should return 404 when user is not found in database', async () => {
      service.getUserWithRoles.mockResolvedValue(null);

      const req = { user: { id: 999 } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'NOT_FOUND',
            message: 'User not found',
          }),
        })
      );
      expect(service.getUserWithRoles).toHaveBeenCalledWith(999);
    });

    it('should return user data without password when authenticated', async () => {
      const fakeUserWithRoles = {
        id: 1,
        username: 'admin',
        email: 'admin@test.com',
        roles: [{ id: 1, name: 'Admin' }],
        permissions: [{ id: 1, resource: 'ODS', action: 'CREAR' }],
      };

      service.getUserWithRoles.mockResolvedValue(fakeUserWithRoles);

      const req = { user: { id: 1 } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await authController.me(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            id: 1,
            username: 'admin',
            email: 'admin@test.com',
            roles: [{ id: 1, name: 'Admin' }],
            permissions: [{ id: 1, resource: 'ODS', action: 'CREAR' }],
          },
        })
      );
      expect(service.getUserWithRoles).toHaveBeenCalledWith(1);
    });
  });
});
