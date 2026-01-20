import { UsersController } from '@modules/users/infrastructure/http/users.controller';
import { Request, Response } from 'express';
import { NotFoundException, UnauthorizedException } from '@shared/exceptions';
import { UserWithRolesDto } from '@sgcv2/shared';
import { UserNotFoundException } from '@modules/users/domain/exceptions/user-not-found.exception';
import { mockUserWithRole } from '../../helpers';

const mockGetUseCase = {
  execute: jest.fn(),
};

const mockUpdateMeUseCase = {
  execute: jest.fn(),
};

const mockShowAllUseCase = {
  execute: jest.fn(),
};

const mockCreateUserUseCase = {
  execute: jest.fn(),
};

const mockUpdateUserUseCase = {
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
    userController = new UsersController(
      mockGetUseCase as any,
      mockUpdateMeUseCase as any,
      mockShowAllUseCase as any,
      mockCreateUserUseCase as any,
      mockUpdateUserUseCase as any
    );

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
    mockGetUseCase.execute.mockResolvedValue(mockUserWithRole);

    mockReq = {
      user: { id: 1 },
    } as unknown as Request;

    await userController.me(mockReq as Request, mockRes as Response);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: {
          id: mockUserWithRole.id,
          username: mockUserWithRole.username,
          email: mockUserWithRole.email,
          firstName: mockUserWithRole.firstName,
          lastName: mockUserWithRole.lastName,
          status: mockUserWithRole.status,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          roles: expect.any(Array),
          permissions: expect.any(Array),
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
    mockGetUseCase.execute.mockRejectedValue(new UserNotFoundException('1'));
    mockReq = {
      user: { id: 1 },
    } as unknown as Request;

    await expect(userController.me(mockReq as Request, mockRes as Response)).rejects.toThrow(
      NotFoundException
    );

    expect(mockGetUseCase.execute).toHaveBeenCalledWith(1);
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

  describe('showAll', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ id: 1, username: 'user1' }];
      mockShowAllUseCase.execute.mockResolvedValue({ items: mockUsers, total: 1 });
      mockReq = { query: { search: 'user1', limit: '10', offset: '0' } };

      await userController.showAll(mockReq as Request, mockRes as Response);

      expect(mockShowAllUseCase.execute).toHaveBeenCalledWith({
        search: 'user1',
        status: undefined,
        pagination: {
          limit: '10',
          offset: '0',
        },
      });

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
          metadata: expect.objectContaining({
            pagination: expect.objectContaining({
              total: 1,
              totalPages: 1,
            }),
          }),
        })
      );
    });
  });

  describe('create', () => {
    it('should create a user and return success', async () => {
      const createData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        status: 'ACTIVE',
      };
      const mockCreatedUser = { id: 2, ...createData };
      mockCreateUserUseCase.execute.mockResolvedValue(mockCreatedUser);

      mockReq = {
        body: createData,
      } as unknown as Request;

      await userController.create(mockReq as Request, mockRes as Response);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(createData);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ username: 'newuser' }),
        })
      );
    });
  });
});
