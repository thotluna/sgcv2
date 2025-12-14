import { UsersController } from '@modules/users/infrastructure/http/user.controller';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';

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
    userController = new UsersController(mockUserService as any);
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
    const mockUser = { id: 1, username: 'test' };
    mockUserService.getUserWithRoles.mockResolvedValue(mockUser);

    mockReq = {
      user: { id: 1 } as any,
    };

    await userController.me(mockReq as Request, mockRes as Response);

    expect(mockUserService.getUserWithRoles).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockUser,
      })
    );
  });

  it('should throw UnauthorizedException if no user in request', async () => {
    mockReq = {};

    await expect(userController.me(mockReq as Request, mockRes as Response)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('should throw NotFoundException if user not found in service', async () => {
    mockUserService.getUserWithRoles.mockResolvedValue(null);
    mockReq = {
      user: { id: 1 } as any,
    };

    await expect(userController.me(mockReq as Request, mockRes as Response)).rejects.toThrow(
      NotFoundException
    );

    expect(mockUserService.getUserWithRoles).toHaveBeenCalledWith(1);
  });
});
