import { serverUsersService } from '../server-users.service';
import { createServerApiClient } from '../server-client';

jest.mock('../server-client');

describe('serverUsersService', () => {
  const mockApiClient = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerApiClient as jest.Mock).mockResolvedValue(mockApiClient);
  });

  describe('getMe', () => {
    it('should fetch current user data', async () => {
      const mockUser = { id: 1, username: 'test' };
      mockApiClient.get.mockResolvedValue({ data: { data: mockUser, success: true } });

      const result = await serverUsersService.getMe();

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateMe', () => {
    it('should send patch request to update user', async () => {
      const updateData = { email: 'new@example.com' };
      const apiResponse = { data: { success: true }, status: 200 };
      mockApiClient.patch.mockResolvedValue(apiResponse);

      const result = await serverUsersService.updateMe(updateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/me', updateData);
      expect(result).toEqual(apiResponse.data);
    });
  });

  describe('getAll', () => {
    it('should fetch all users with filters', async () => {
      const mockUsers = [{ id: 1, username: 'user1' }];
      const filters = { search: 'test', pagination: { limit: 10, offset: 0 } };
      mockApiClient.get.mockResolvedValue({ data: { data: mockUsers, success: true } });

      const result = await serverUsersService.getAll(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/users', {
        params: {
          search: 'test',
          limit: 10,
          offset: 0,
        },
      });
      expect(result).toEqual({ data: mockUsers, success: true });
    });

    it('should work without filters', async () => {
      mockApiClient.get.mockResolvedValue({ data: { success: true } });
      await serverUsersService.getAll();
      expect(mockApiClient.get).toHaveBeenCalledWith('/users', { params: {} });
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id', async () => {
      const mockUser = { id: 123 };
      mockApiClient.get.mockResolvedValue({ data: { data: mockUser, success: true } });

      const result = await serverUsersService.getUserById(123);

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/123');
      expect(result).toEqual({ data: mockUser, success: true });
    });
  });

  describe('updateUser', () => {
    it('should update user by id', async () => {
      const updateData = { firstName: 'Updated' };
      mockApiClient.patch.mockResolvedValue({ data: { success: true } });

      const result = await serverUsersService.updateUser(123, updateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/123', updateData);
      expect(result).toEqual({ success: true });
    });
  });
});
