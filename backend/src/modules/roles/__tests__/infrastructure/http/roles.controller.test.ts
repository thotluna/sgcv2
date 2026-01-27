import { mockRole } from '@roles/__tests__/helpers';
import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { DeleteRoleUseCase } from '@roles/application/delete-role.use-case';
import { GetRoleUseCase } from '@roles/application/get-role.use-case';
import { ListPermissionsUseCase } from '@roles/application/list-permissions.use-case';
import { ListRolesUseCase } from '@roles/application/list-roles.use-case';
import { UpdateRoleUseCase } from '@roles/application/update-role.use-case';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { RoleInUseException } from '@roles/domain/exceptions/role-in-use-exception';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { RolesController } from '@roles/infrastructure/http/roles.controller';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@shared/exceptions/http-exceptions';
import { Request, Response } from 'express';

const mockCreateRoleUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateRoleUseCase>;

const mockListRolesUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<ListRolesUseCase>;

const mockGetRoleUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetRoleUseCase>;

const mockUpdateRoleUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<UpdateRoleUseCase>;

const mockDeleteRoleUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<DeleteRoleUseCase>;

const mockListPermissionsUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<ListPermissionsUseCase>;

describe('RolesController', () => {
  let controller: RolesController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    controller = new RolesController(
      mockCreateRoleUseCase,
      mockListRolesUseCase,
      mockGetRoleUseCase,
      mockUpdateRoleUseCase,
      mockDeleteRoleUseCase,
      mockListPermissionsUseCase
    );
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

  describe('getById', () => {
    it('should return a role by id', async () => {
      mockGetRoleUseCase.execute.mockResolvedValue(mockRole);
      mockReq = { params: { id: '1' } };

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockGetRoleUseCase.execute).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ id: mockRole.id }),
        })
      );
    });

    it('should throw NotFoundException if role not found', async () => {
      mockGetRoleUseCase.execute.mockRejectedValue(new RoleNotFoundException(1));
      mockReq = { params: { id: '1' } };

      await expect(controller.getById(mockReq as Request, mockRes as Response)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    const updateDto = { name: 'New Name' };

    it('should update a role', async () => {
      mockUpdateRoleUseCase.execute.mockResolvedValue({ ...mockRole, name: 'New Name' });
      mockReq = { params: { id: '1' }, body: updateDto };

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockUpdateRoleUseCase.execute).toHaveBeenCalledWith(1, expect.any(Object));
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should throw NotFoundException if role not found', async () => {
      mockUpdateRoleUseCase.execute.mockRejectedValue(new RoleNotFoundException(1));
      mockReq = { params: { id: '1' }, body: updateDto };

      await expect(controller.update(mockReq as Request, mockRes as Response)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      mockDeleteRoleUseCase.execute.mockResolvedValue(undefined);
      mockReq = { params: { id: '1' } };

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockDeleteRoleUseCase.execute).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
    });

    it('should throw NotFoundException if role not found', async () => {
      mockDeleteRoleUseCase.execute.mockRejectedValue(new RoleNotFoundException(1));
      mockReq = { params: { id: '1' } };

      await expect(controller.delete(mockReq as Request, mockRes as Response)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if role is in use', async () => {
      mockDeleteRoleUseCase.execute.mockRejectedValue(new RoleInUseException(1, 5));
      mockReq = { params: { id: '1' } };

      await expect(controller.delete(mockReq as Request, mockRes as Response)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getAllPermissions', () => {
    it('should return all permissions', async () => {
      const mockPermissions = [{ id: 1, resource: 'res', action: 'act', description: 'desc' }];
      mockListPermissionsUseCase.execute.mockResolvedValue(mockPermissions as any);
      mockReq = {};

      await controller.getAllPermissions(mockReq as Request, mockRes as Response);

      expect(mockListPermissionsUseCase.execute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
        })
      );
    });
  });
});
