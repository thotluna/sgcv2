import { PermissionRepository } from '@permissions/domain/permission.repository';
import { PermissionsService } from '@permissions/infrastructure/http/permissions.service';

import { mockPermission } from '../../helpers';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repository: jest.Mocked<PermissionRepository>;

  beforeEach(() => {
    repository = {
      getAll: jest.fn(),
      findById: jest.fn(),
      findByResourceAndAction: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PermissionRepository>;

    service = new PermissionsService(repository);
  });

  describe('getAllPermissions', () => {
    it('should return all permissions from repository', async () => {
      const mockPermissions = [mockPermission];
      repository.getAll.mockResolvedValue(mockPermissions);

      const result = await service.getAllPermissions();

      expect(result).toEqual(mockPermissions);
      expect(repository.getAll).toHaveBeenCalledWith(undefined);
    });

    it('should pass filters to repository', async () => {
      const filter = { search: 'test', page: 1, limit: 10 };
      repository.getAll.mockResolvedValue([]);

      await service.getAllPermissions(filter);

      expect(repository.getAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findPermissionById', () => {
    it('should return a permission by id', async () => {
      repository.findById.mockResolvedValue(mockPermission);

      const result = await service.findPermissionById(1);

      expect(result).toEqual(mockPermission);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if permission not found', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.findPermissionById(999);

      expect(result).toBeNull();
    });
  });
});
