import { UsersController } from '@modules/users/infrastructure/http/user.controller';
import { UsersRoutes } from '@modules/users/infrastructure/http/users.routes';
import { Application, Request, Response } from 'express';
import express from 'express';
import request from 'supertest';
import { UsersService } from '@modules/users/domain/user.service';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { UserWithRolesEntity } from '@modules/users/domain/user-entity';

// Mock utility helpers
jest.mock('@shared/utils/response.helpers');

// Mock the authenticate middleware
jest.mock('@auth/infrastructure/http/auth.middleware', () => ({
  authenticate: jest.fn((req: Request, _res: Response, next: (err?: Error) => void) => {
    // The real middleware would attach a DTO-like object.
    // The controller casts this to UserWithRolesDto and uses the id.
    req.user = { id: 1, username: 'test-user' };
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

      // Mock the success response helper to check what is being passed
      (ResponseHelper.success as jest.Mock).mockImplementation((res, data) => {
        // The real helper would serialize the Date objects
        return res.status(200).json(JSON.parse(JSON.stringify(data)));
      });

      // Act
      const response = await request(app).get('/users/me');

      // Assert
      expect(response.status).toBe(200);
      // The response body will have dates as strings, so we compare with a stringified version
      expect(response.body).toEqual(JSON.parse(JSON.stringify(mockUserEntity)));
      expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(1);
      expect(ResponseHelper.success).toHaveBeenCalledWith(expect.anything(), mockUserEntity);
    });

    it('should return 404 if the user is not found', async () => {
      // Mock the service method to return null
      mockUsersService.getUserWithRoles.mockResolvedValue(null);

      (ResponseHelper.notFound as jest.Mock).mockImplementation((res, message) => {
        return res.status(404).json({ message });
      });

      // Act
      const response = await request(app).get('/users/me');

      // Assert
      expect(response.status).toBe(404);
      expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(1);
      expect(ResponseHelper.notFound).toHaveBeenCalledWith(expect.anything(), 'User not found');
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const errorMessage = 'An error occurred while fetching user data';
      mockUsersService.getUserWithRoles.mockRejectedValue(new Error('Database error'));

      (ResponseHelper.internalError as jest.Mock).mockImplementation((res, message) => {
        return res.status(500).json({ message });
      });

      // Act
      const response = await request(app).get('/users/me');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessage);
      expect(mockUsersService.getUserWithRoles).toHaveBeenCalledWith(1);
      expect(ResponseHelper.internalError).toHaveBeenCalledWith(expect.anything(), errorMessage);
    });
  });
});
