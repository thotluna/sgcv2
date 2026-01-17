import { RolesService } from '@roles/infrastructure/http/roles.service';
import { RoleRepository } from '@roles/domain/role.repository';
import { PermissionRepository } from '@roles/domain/permission.repository';
import { mockRole, mockPermission } from '@roles/__tests__/helpers';

const mockRoleRepository = {
  findByName: jest.fn(),
  create: jest.fn(),
} as unknown as jest.Mocked<RoleRepository>;

const mockPermissionRepository = {
  findById: jest.fn(),
} as unknown as jest.Mocked<PermissionRepository>;

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(() => {
    service = new RolesService(mockRoleRepository, mockPermissionRepository);
    jest.clearAllMocks();
  });

  describe('findPermissionById', () => {
    it('should call permissionRepository.findById', async () => {
      mockPermissionRepository.findById.mockResolvedValue(mockPermission);

      const result = await service.findPermissionById(1);

      expect(mockPermissionRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPermission);
    });
  });

  describe('findByName', () => {
    it('should call roleRepository.findByName', async () => {
      mockRoleRepository.findByName.mockResolvedValue(mockRole);

      const result = await service.findByName('Admin');

      expect(mockRoleRepository.findByName).toHaveBeenCalledWith('Admin');
      expect(result).toEqual(mockRole);
    });
  });

  describe('create', () => {
    it('should call roleRepository.create', async () => {
      const input = { name: 'Admin', permissionIds: [1] };
      mockRoleRepository.create.mockResolvedValue(mockRole);

      const result = await service.create(input);

      expect(mockRoleRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockRole);
    });
  });
});
