import { Request, Response } from 'express';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

// Mock UsersService
jest.mock('../users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let mockService: jest.Mocked<UsersService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockService = new UsersService() as jest.Mocked<UsersService>;
    controller = new UsersController();
    // Inject mock service (since it's private, we cast to any)
    (controller as any).usersService = mockService;

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson,
    };

    // Silence console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('me', () => {
    it('should return current user profile', async () => {
      mockReq = {
        user: { id: 1 } as any,
      };

      const mockUser = { id: 1, username: 'test' };
      mockService.getUserWithRoles.mockResolvedValue(mockUser as any);

      await controller.me(mockReq as Request, mockRes as Response);

      expect(mockService.getUserWithRoles).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it('should return 401 if no user in request', async () => {
      mockReq = {};

      await controller.me(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('getAll', () => {
    it('should return paginated users', async () => {
      mockReq = {
        query: { page: '1', limit: '10' },
      };

      const mockResult = {
        users: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
      mockService.findAll.mockResolvedValue(mockResult);

      await controller.getAll(mockReq as Request, mockRes as Response);

      expect(mockService.findAll).toHaveBeenCalledWith(1, 10, { estado: undefined });
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getById', () => {
    it('should return user if found', async () => {
      mockReq = { params: { id: '1' } };
      const mockUser = { id: 1, username: 'test' };
      mockService.getUserWithRoles.mockResolvedValue(mockUser as any);

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockService.getUserWithRoles).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      mockReq = { params: { id: '999' } };
      mockService.getUserWithRoles.mockResolvedValue(null);

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 400 if invalid ID', async () => {
      mockReq = { params: { id: 'invalid' } };

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid user ID' });
    });

    it('should handle errors', async () => {
      mockReq = { params: { id: '1' } };
      mockService.getUserWithRoles.mockRejectedValue(new Error('DB Error'));

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      mockReq = {
        body: {
          username: 'newuser',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const mockUser = { id: 1, ...mockReq.body };
      mockService.createUser.mockResolvedValue(mockUser);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockService.createUser).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 if required fields missing', async () => {
      mockReq = {
        body: { username: 'test' }, // Missing email and password
      };

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 if invalid email', async () => {
      mockReq = {
        body: {
          username: 'test',
          email: 'invalid-email',
          password: 'password123',
        },
      };

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid email format' })
      );
    });

    it('should return 400 if password too short', async () => {
      mockReq = {
        body: {
          username: 'test',
          email: 'test@example.com',
          password: '123',
        },
      };

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Password must be at least 6 characters long' })
      );
    });

    it('should return 409 if username/email exists', async () => {
      mockReq = {
        body: {
          username: 'test',
          email: 'test@example.com',
          password: 'password123',
        },
      };
      mockService.createUser.mockRejectedValue(new Error('Username already exists'));

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(409);
    });

    it('should handle errors', async () => {
      mockReq = {
        body: {
          username: 'test',
          email: 'test@example.com',
          password: 'password123',
        },
      };
      mockService.createUser.mockRejectedValue(new Error('DB Error'));

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      mockReq = {
        params: { id: '1' },
        body: { email: 'updated@example.com' },
        user: { id: 1 } as any, // Own profile
      };

      const mockUser = { id: 1, email: 'updated@example.com' };
      mockService.updateUser.mockResolvedValue(mockUser as any);

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockService.updateUser).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it('should forbid update if not owner or admin', async () => {
      mockReq = {
        params: { id: '2' }, // Different ID
        body: { email: 'updated@example.com' },
        user: {
          id_usuario: 1,
          roles: [{ name: 'User' }],
        } as any,
      };

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(403);
    });

    it('should return 400 if invalid ID', async () => {
      mockReq = { params: { id: 'invalid' }, user: { id: 1 } as any };

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 if invalid email', async () => {
      mockReq = {
        params: { id: '1' },
        body: { email: 'invalid' },
        user: { id: 1 } as any,
      };

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 if password too short', async () => {
      mockReq = {
        params: { id: '1' },
        body: { password: '123' },
        user: { id: 1 } as any,
      };

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 403 if non-admin tries to update roles', async () => {
      mockReq = {
        params: { id: '1' },
        body: { roleIds: [1] },
        user: { id: 1, roles: [] } as any,
      };

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(403);
    });

    it('should return 404 if user not found', async () => {
      mockReq = {
        params: { id: '1' },
        body: { email: 'test@example.com' },
        user: { id: 1 } as any,
      };
      mockService.updateUser.mockRejectedValue(new Error('User not found'));

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it('should return 409 if email exists', async () => {
      mockReq = {
        params: { id: '1' },
        body: { email: 'test@example.com' },
        user: { id: 1 } as any,
      };
      mockService.updateUser.mockRejectedValue(new Error('Email already exists'));

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(409);
    });

    it('should handle errors', async () => {
      mockReq = {
        params: { id: '1' },
        body: { email: 'test@example.com' },
        user: { id: 1 } as any,
      };
      mockService.updateUser.mockRejectedValue(new Error('DB Error'));

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      mockReq = {
        params: { id: '1' },
      };

      const mockUser = { id: 1, state: 'INACTIVE' };
      mockService.deleteUser.mockResolvedValue(mockUser as any);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockService.deleteUser).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'User deactivated successfully',
        user: mockUser,
      });
    });

    it('should return 400 if invalid ID', async () => {
      mockReq = { params: { id: 'invalid' } };

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should handle errors', async () => {
      mockReq = { params: { id: '1' } };
      mockService.deleteUser.mockRejectedValue(new Error('DB Error'));

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });
});
