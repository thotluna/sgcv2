import { UsersController } from '@modules/users/infrastructure/http/users.controller';
import { UsersRoutes } from '@modules/users/infrastructure/http/users.routes';
import { Application, Request, Response } from 'express';
import express from 'express';
import request from 'supertest';
import { globalErrorHandler } from '@shared/middleware/global-error.middleware';
import { authenticate } from '@auth/infrastructure/http/auth.middleware';

jest.mock('@auth/infrastructure/http/auth.middleware', () => ({
  authenticate: jest.fn(),
}));

jest.mock('@modules/rbac/guards/roles.guard', () => ({
  requireRoles: jest.fn(() => (_req: Request, _res: Response, next: any) => next()),
}));

const mockUsersController = {
  me: jest.fn(),
  updateMe: jest.fn(),
  showAll: jest.fn(),
  create: jest.fn(),
} as unknown as UsersController;

describe('UsersRoutes', () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation: Success (Authorized)
    (authenticate as jest.Mock).mockImplementation(
      (req: Request, _res: Response, next: (err?: Error) => void) => {
        req.user = { id: '1', username: 'test-user', role: 'admin', roles: ['admin'] };
        next();
      }
    );

    app = express();
    app.use(express.json());

    // Inject the mocked controller
    const usersRouter = new UsersRoutes(mockUsersController);
    app.use('/users', usersRouter.getRouter());

    app.use(globalErrorHandler);
  });

  describe('GET /users/me', () => {
    it('should delegate request to usersController.me when authenticated', async () => {
      const mockResponse = { id: 1, username: 'test-user' };
      (mockUsersController.me as jest.Mock).mockImplementation((_req: Request, res: Response) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).get('/users/me');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockUsersController.me).toHaveBeenCalledTimes(1);
    });

    it('should return 401 if user is not authenticated', async () => {
      (authenticate as jest.Mock).mockImplementation(
        (_req: Request, res: Response, _next: (err?: Error) => void) => {
          res.status(401).json({ message: 'Unauthorized' });
        }
      );

      const response = await request(app).get('/users/me');

      expect(response.status).toBe(401);
      expect(mockUsersController.me).not.toHaveBeenCalled();
    });
  });

  describe('GET /users', () => {
    it('should delegate request to usersController.showAll when authenticated and authorized', async () => {
      const mockResponse = [{ id: 1, username: 'test-user' }];
      (mockUsersController.showAll as jest.Mock).mockImplementation(
        (_req: Request, res: Response) => {
          res.status(200).json(mockResponse);
        }
      );

      const response = await request(app).get('/users').query({ limit: '5' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockUsersController.showAll).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything()
      );
    });

    it('should return 400 if filter validation fails', async () => {
      const response = await request(app).get('/users').query({ status: 'INVALID' });

      expect(response.status).toBe(400);
      expect(mockUsersController.showAll).not.toHaveBeenCalled();
    });
  });

  describe('POST /users', () => {
    it('should create a user when data is valid', async () => {
      const validUserData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };
      const mockResponse = { id: 2, ...validUserData };
      (mockUsersController.create as jest.Mock).mockImplementation(
        (_req: Request, res: Response) => {
          res.status(201).json({ success: true, data: mockResponse });
        }
      );

      const response = await request(app).post('/users').send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockResponse);
      expect(mockUsersController.create).toHaveBeenCalled();
    });

    it('should return 400 when data is invalid', async () => {
      const invalidUserData = {
        username: 'us', // too short
        email: 'not-an-email',
      };

      const response = await request(app).post('/users').send(invalidUserData);

      expect(response.status).toBe(400);
      expect(mockUsersController.create).not.toHaveBeenCalled();
    });
  });
});
