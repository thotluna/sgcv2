import { UsersController } from '@modules/users/infrastructure/http/users.controller';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { UserWithRolesDto } from '@sgcv2/shared';
import { UserNotFoundException } from '@modules/users/domain/exceptions/user-no-found.exception';
import { mockUserWithRole } from '../../helpers';

const mockShowMeUseCase = {
  execute: jest.fn(),
};

const mockUpdateMeUseCase = {
  execute: jest.fn(),
};

describe('UserController', () => {
  let userController: UsersController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    userController = new UsersController(mockShowMeUseCase as any, mockUpdateMeUseCase as any);
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson,
    } as unknown as Response;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should get user with roles', async () => {
    mockShowMeUseCase.execute.mockResolvedValue(mockUserWithRole);

    mockReq = {
      user: { id: 1 },
    } as unknown as Request;

    await userController.me(mockReq as Request, mockRes as Response);

    expect(mockShowMeUseCase.execute).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: {
          id: mockUserWithRole.id,
          username: mockUserWithRole.username,
          email: mockUserWithRole.email,
          firstName: mockUserWithRole.firstName,
          lastName: mockUserWithRole.lastName,
          isActive: mockUserWithRole.status,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          roles: expect.any(Array),
        } satisfies UserWithRolesDto,
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
    mockShowMeUseCase.execute.mockRejectedValue(new UserNotFoundException('1'));
    mockReq = {
      user: { id: 1 },
    } as unknown as Request;

    await expect(userController.me(mockReq as Request, mockRes as Response)).rejects.toThrow(
      NotFoundException
    );

    expect(mockShowMeUseCase.execute).toHaveBeenCalledWith(1);
  });

  describe('updateMe', () => {
    it('should update user and return success', async () => {
      const updateData = { firstName: 'Updated' };
      mockUpdateMeUseCase.execute.mockResolvedValue({
        ...mockUserWithRole,
        firstName: 'Updated',
      });

      mockReq = {
        user: { id: 1 },
        body: updateData,
      } as unknown as Request;

      await userController.updateMe(mockReq as Request, mockRes as Response);

      expect(mockUpdateMeUseCase.execute).toHaveBeenCalledWith(1, updateData);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ firstName: 'Updated' }),
        })
      );
    });

    it('should throw UnauthorizedException if no user in request', async () => {
      mockReq = { body: {} };

      await expect(
        userController.updateMe(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should propagate errors from use case', async () => {
      const error = new Error('Some error');
      mockUpdateMeUseCase.execute.mockRejectedValue(error);
      mockReq = {
        user: { id: 1 },
        body: {},
      } as unknown as Request;

      await expect(
        userController.updateMe(mockReq as Request, mockRes as Response)
      ).rejects.toThrow(error);
    });
  });
});
