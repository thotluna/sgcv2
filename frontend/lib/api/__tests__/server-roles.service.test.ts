import { serverRolesService } from '../server-roles.service';
import { createServerApiClient } from '../server-client';

jest.mock('../server-client');

describe('serverRolesService', () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerApiClient as jest.Mock).mockResolvedValue(mockApiClient);
  });

  describe('getAllPermissions', () => {
    it('should fetch all permissions', async () => {
      const mockPermissions = [
        { id: 1, resource: 'users', action: 'read', description: 'Read users' },
      ];
      mockApiClient.get.mockResolvedValue({
        data: { data: mockPermissions, success: true },
      });

      const result = await serverRolesService.getAllPermissions();

      expect(mockApiClient.get).toHaveBeenCalledWith('/roles/permissions');
      expect(result).toEqual({ data: mockPermissions, success: true });
    });

    it('should handle errors when fetching permissions', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(serverRolesService.getAllPermissions()).rejects.toThrow('Network error');
    });
  });
});
