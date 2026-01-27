import { fetchClient } from '@lib/api/fetch-client';
import { CreateRoleDto, UpdateRoleDto } from '@sgcv2/shared';

import {
  createRole,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getRoleById,
  updateRole,
} from '../service';

jest.mock('@lib/api/fetch-client');

describe('Roles Service', () => {
  const mockFetchClient = fetchClient as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRoles', () => {
    it('should call fetchClient with correct params', async () => {
      mockFetchClient.mockResolvedValue({ success: true, data: [] });

      await getAllRoles({ search: 'admin', pagination: { limit: 10, offset: 0 } });

      expect(mockFetchClient).toHaveBeenCalledWith('/roles?search=admin&page=1&limit=10', {
        method: 'GET',
      });
    });

    it('should call fetchClient without params when filter is empty', async () => {
      mockFetchClient.mockResolvedValue({ success: true, data: [] });

      await getAllRoles();

      expect(mockFetchClient).toHaveBeenCalledWith('/roles', {
        method: 'GET',
      });
    });
  });

  describe('getRoleById', () => {
    it('should fetch role by id', async () => {
      mockFetchClient.mockResolvedValue({ success: true, data: {} });

      await getRoleById(1);

      expect(mockFetchClient).toHaveBeenCalledWith('/roles/1', {
        method: 'GET',
      });
    });
  });

  describe('createRole', () => {
    it('should create role', async () => {
      const dto: CreateRoleDto = { name: 'Admin', permissionIds: [1] };
      mockFetchClient.mockResolvedValue({ success: true, data: {} });

      await createRole(dto);

      expect(mockFetchClient).toHaveBeenCalledWith('/roles', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    });
  });

  describe('updateRole', () => {
    it('should update role', async () => {
      const dto: UpdateRoleDto = { name: 'Updated' };
      mockFetchClient.mockResolvedValue({ success: true, data: {} });

      await updateRole(1, dto);

      expect(mockFetchClient).toHaveBeenCalledWith('/roles/1', {
        method: 'PATCH',
        body: JSON.stringify(dto),
      });
    });
  });

  describe('deleteRole', () => {
    it('should delete role', async () => {
      mockFetchClient.mockResolvedValue({ success: true });

      await deleteRole(1);

      expect(mockFetchClient).toHaveBeenCalledWith('/roles/1', {
        method: 'DELETE',
      });
    });
  });

  describe('getAllPermissions', () => {
    it('should fetch all permissions', async () => {
      mockFetchClient.mockResolvedValue({ success: true, data: [] });

      await getAllPermissions();

      expect(mockFetchClient).toHaveBeenCalledWith('/roles/permissions', {
        method: 'GET',
      });
    });
  });
});
