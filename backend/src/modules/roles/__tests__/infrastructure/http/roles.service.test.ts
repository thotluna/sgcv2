import { mockRole } from '@roles/__tests__/helpers';
import { RoleRepository } from '@roles/domain/role.repository';
import { RolesService } from '@roles/infrastructure/http/roles.service';

const mockRoleRepository = {
  findByName: jest.fn(),
  create: jest.fn(),
  getAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addPermissions: jest.fn(),
  removePermissions: jest.fn(),
  countUsersWithRole: jest.fn(),
} as unknown as jest.Mocked<RoleRepository>;

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(() => {
    service = new RolesService(mockRoleRepository);
    jest.clearAllMocks();
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

  describe('getListRoles', () => {
    it('should call roleRepository.getAll', async () => {
      const filter = { search: 'test', page: 1, limit: 10 };
      const mockResult = { items: [mockRole], total: 1 };
      mockRoleRepository.getAll.mockResolvedValue(mockResult);

      const result = await service.getListRoles(filter);

      expect(mockRoleRepository.getAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockResult);
    });
  });

  describe('addPermissions', () => {
    it('should call roleRepository.addPermissions', async () => {
      mockRoleRepository.addPermissions.mockResolvedValue();
      await service.addPermissions(1, [1, 2]);
      expect(mockRoleRepository.addPermissions).toHaveBeenCalledWith(1, [1, 2]);
    });
  });
});
