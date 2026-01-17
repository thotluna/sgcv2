import { RolesMapper } from '@roles/infrastructure/mappers/roles.mapper';
import { mockRole } from '@roles/__tests__/helpers';

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
