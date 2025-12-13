import { UsersController } from '@modules/users/infrastructure/http/user.controller';
import { Request, Response } from 'express';

const mockUserService = {
  getUserWithRoles: jest.fn(),
};

describe('UserController', () => {
  let userController: UsersController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    userController = new UsersController(mockUserService);
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should get user with roles', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      roles: ['admin'],
    };
    mockUserService.getUserWithRoles.mockResolvedValue(user);

    mockReq = {
      user: { id: 1 } as any,
    };

    const mockUser = { id: 1, username: 'test' };
    mockUserService.getUserWithRoles.mockResolvedValue(mockUser);

    await userController.me(mockReq as Request, mockRes as Response);

    expect(mockUserService.getUserWithRoles).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockUser,
      })
    );
  });

  it('should return 401 if no user in request', async () => {
    mockReq = {};

    await userController.me(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        }),
      })
    );
  });
});
