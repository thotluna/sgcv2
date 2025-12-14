import { UsersController } from '@modules/users/infrastructure/http/user.controller';
import { UsersRoutes } from '@modules/users/infrastructure/http/users.routes';
import { Application, Request, Response } from 'express';
import express from 'express';
import request from 'supertest';
import { UsersService } from '@modules/users/domain/user.service';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { UserWithRolesEntity } from '@modules/users/domain/user-entity';
import { globalErrorHandler } from '@shared/middleware/global-error.middleware';

// Mock utility helpers (only mocking success to keep test simple or consistent if desired, but ideally we use real one too)
jest.mock('@shared/utils/response.helpers');

// Mock the authenticate middleware
jest.mock('@auth/infrastructure/http/auth.middleware', () => ({
  authenticate: jest.fn((req: Request, _res: Response, next: (err?: Error) => void) => {
    // The real middleware would attach a DTO-like object.
    // The controller casts this to UserWithRolesDto and uses the id.
    req.user = { id: '1', username: 'test-user', role: 'admin', roles: ['admin'] };
    next();
  }),
}));

describe('UsersRoutes', () => {
  let app: Application;
  let mockUsersService: jest.Mocked<UsersService>;
  let usersController: UsersController;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());

    // Create a manual mock for the service interface
    mockUsersService = {
      getUserWithRoles: jest.fn(),
    };

    // Instantiate the real controller with the mocked service
    usersController = new UsersController(mockUsersService);

    // Instantiate UsersRoutes with the real controller
    const usersRouter = new UsersRoutes(usersController);
    app.use('/users', usersRouter.getRouter());

    // Add Global Error Handler to the test app
    app.use(globalErrorHandler);
  });

  describe('GET /users/me', () => {
    it('should return the current user with roles when found', async () => {
      const mockUserEntity: UserWithRolesEntity = {
        id: 1,
        username: 'test-user',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: 'hashed-password',
        roles: [],
      };

      // Mock the service method to return the user entity
      mockUsersService.getUserWithRoles.mockResolvedValue(mockUserEntity);

      // Mock the success response helper
      (ResponseHelper.success as jest.Mock).mockImplementation((res, data) => {
        return res.status(200).json(JSON.parse(JSON.stringify(data)));
      });

      // Act
      const response = await request(app).get('/users/me');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(JSON.parse(JSON.stringify(mockUserEntity)));
      expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(1);
    });

    it('should return 404 if the user is not found', async () => {
      // Mock the service method to return null, which causes controller to throw NotFoundException
      mockUsersService.getUserWithRoles.mockResolvedValue(null);

      // Act
      const response = await request(app).get('/users/me');

      // Assert
      expect(response.status).toBe(404);
      expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(1);

      // Check for AppResponse error structure
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'NOT_FOUND',
            message: 'User not found',
          }),
        })
      );
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const errorMessage = 'Database error';
      mockUsersService.getUserWithRoles.mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await request(app).get('/users/me');

      // Assert
      expect(response.status).toBe(500);
      expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(1);

      // Check for AppResponse error structure (default for unknown errors)
      // Check for AppResponse error structure (default for unknown errors)
      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Internal Server Error',
          // In test environment, we expect the generic message
          message: 'Something went wrong',
        })
      );
    });
  });
});
