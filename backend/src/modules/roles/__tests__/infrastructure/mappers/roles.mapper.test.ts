import { mockRole } from '@roles/__tests__/helpers';
import { RolesMapper } from '@roles/infrastructure/mappers/roles.mapper';

describe('RolesMapper', () => {
  describe('toCreateInput', () => {
    it('should map CreateRoleDto to CreateRoleInput', () => {
      const dto = {
        name: 'Manager',
        description: 'Managerial role',
        permissionIds: [1, 2],
      };

      const result = RolesMapper.toCreateInput(dto);

      expect(result).toEqual({
        name: 'Manager',
        description: 'Managerial role',
        permissionIds: [1, 2],
      });
    });

    it('should handle missing permissionIds in DTO', () => {
      const dto = { name: 'Simple' };
      const result = RolesMapper.toCreateInput(dto as any);
      expect(result.permissionIds).toEqual([]);
    });
  });

  describe('toDto', () => {
    it('should map RoleEntity to RoleDto', () => {
      const result = RolesMapper.toDto(mockRole);

      expect(result).toEqual({
        id: mockRole.id,
        name: mockRole.name,
        description: mockRole.description,
        createdAt: mockRole.createdAt,
        updatedAt: mockRole.updatedAt,
      });
    });
  });

  describe('toFilterInput', () => {
    it('should map RoleFilterDto to RoleFilterInput', () => {
      const dto = {
        search: 'test',
        pagination: { limit: 10, offset: 20 },
      };

      const result = RolesMapper.toFilterInput(dto);

      expect(result).toEqual({
        search: 'test',
        page: 3,
        limit: 10,
      });
    });

    it('should use defaults for missing pagination', () => {
      const dto = { search: 'test' };
      const result = RolesMapper.toFilterInput(dto);

      expect(result).toEqual({
        search: 'test',
        page: 1,
        limit: 10,
      });
    });
  });

  describe('toWithPermissionsDto', () => {
    it('should map RoleEntity to RoleWithPermissionsDto', () => {
      const result = RolesMapper.toWithPermissionsDto(mockRole);

      expect(result).toEqual({
        id: mockRole.id,
        name: mockRole.name,
        description: mockRole.description,
        createdAt: mockRole.createdAt,
        updatedAt: mockRole.updatedAt,
        permissions: [
          {
            id: mockRole.permissions![0].id,
            resource: mockRole.permissions![0].resource,
            action: mockRole.permissions![0].action,
            description: mockRole.permissions![0].description,
          },
        ],
      });
    });
  });
});
