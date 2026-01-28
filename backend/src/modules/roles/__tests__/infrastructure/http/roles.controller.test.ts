import { mockRole } from '@roles/__tests__/helpers';
import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { DeleteRoleUseCase } from '@roles/application/delete-role.use-case';
import { GetRoleUseCase } from '@roles/application/get-role.use-case';
import { ListRolesUseCase } from '@roles/application/list-roles.use-case';
import { UpdateRoleUseCase } from '@roles/application/update-role.use-case';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { RolesController } from '@roles/infrastructure/http/roles.controller';
import { ConflictException } from '@shared/exceptions/http-exceptions';
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
      mockDeleteRoleUseCase
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
    });

    it('should throw ConflictException if role already exists', async () => {
      mockCreateRoleUseCase.execute.mockRejectedValue(new RoleAlreadyExistsException('Admin'));
      mockReq = { body: createDto };

      await expect(controller.create(mockReq as Request, mockRes as Response)).rejects.toThrow(
        ConflictException
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

      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('getById', () => {
    it('should return a role by id', async () => {
      mockGetRoleUseCase.execute.mockResolvedValue(mockRole);
      mockReq = { params: { id: '1' } };

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      mockUpdateRoleUseCase.execute.mockResolvedValue({ ...mockRole, name: 'New Name' });
      mockReq = { params: { id: '1' }, body: { name: 'New Name' } };

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      mockDeleteRoleUseCase.execute.mockResolvedValue(undefined);
      mockReq = { params: { id: '1' } };

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(204);
    });
  });
});
