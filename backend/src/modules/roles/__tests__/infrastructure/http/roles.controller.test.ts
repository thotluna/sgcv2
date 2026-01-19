import { RolesController } from '@roles/infrastructure/http/roles.controller';
import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { ListRolesUseCase } from '@roles/application/list-roles.use-case';
import { Request, Response } from 'express';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import { ConflictException, BadRequestException } from '@shared/exceptions/http-exceptions';
import { mockRole } from '@roles/__tests__/helpers';

const mockCreateRoleUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateRoleUseCase>;

const mockListRolesUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<ListRolesUseCase>;

describe('RolesController', () => {
  let controller: RolesController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    controller = new RolesController(mockCreateRoleUseCase, mockListRolesUseCase);
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson,
    } as unknown as Response;
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      name: 'Admin',
      description: 'Role with all permissions',
      permissionIds: [1, 2],
    };

    it('should create a role and return success', async () => {
      mockCreateRoleUseCase.execute.mockResolvedValue(mockRole);
      mockReq = { body: createDto };

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockCreateRoleUseCase.execute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: mockRole.id,
            name: mockRole.name,
          }),
        })
      );
    });

    it('should throw ConflictException if role already exists', async () => {
      mockCreateRoleUseCase.execute.mockRejectedValue(new RoleAlreadyExistsException('Admin'));
      mockReq = { body: createDto };

      await expect(controller.create(mockReq as Request, mockRes as Response)).rejects.toThrow(
        ConflictException
      );
    });

    it('should throw BadRequestException if permission not found', async () => {
      mockCreateRoleUseCase.execute.mockRejectedValue(new PermissionNotFoundException(1));
      mockReq = { body: createDto };

      await expect(controller.create(mockReq as Request, mockRes as Response)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException if role could not be created', async () => {
      mockCreateRoleUseCase.execute.mockResolvedValue(null);
      mockReq = { body: createDto };

      await expect(controller.create(mockReq as Request, mockRes as Response)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getAll', () => {
    it('should return paginated roles', async () => {
      const mockPaginated = {
        items: [mockRole],
        total: 1,
      };
      mockListRolesUseCase.execute.mockResolvedValue(mockPaginated);
      mockReq = { query: { search: 'Admin', page: '1', limit: '10' } };

      await controller.getAll(mockReq as Request, mockRes as Response);

      expect(mockListRolesUseCase.execute).toHaveBeenCalledWith({
        search: 'Admin',
        page: 1,
        limit: 10,
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
          metadata: expect.objectContaining({
            pagination: expect.objectContaining({
              total: 1,
              page: 1,
            }),
          }),
        })
      );
    });
  });
});
