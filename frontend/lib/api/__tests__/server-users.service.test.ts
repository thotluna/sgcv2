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
});
