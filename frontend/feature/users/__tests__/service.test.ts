import { fetchClient } from '@/lib/api/fetch-client';
import { CreateUserDto, UpdateUserDto } from '@sgcv2/shared';

import { create, getAll, getMe, getUserById, updateMe, updateUser } from '../service';

jest.mock('@/lib/api/fetch-client');

describe('Users Service', () => {
  const mockFetchClient = fetchClient as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should call fetchClient', async () => {
      mockFetchClient.mockResolvedValue({ success: true });
      await getMe();
      expect(mockFetchClient).toHaveBeenCalledWith('/users/me', { method: 'GET' });
    });
  });

  describe('updateMe', () => {
    it('should call fetchClient with PATCH', async () => {
      const dto: UpdateUserDto = { firstName: 'Test' };
      mockFetchClient.mockResolvedValue({ success: true });
      await updateMe(dto);
      expect(mockFetchClient).toHaveBeenCalledWith('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(dto),
      });
    });
  });

  describe('getUserById', () => {
    it('should fetch user', async () => {
      mockFetchClient.mockResolvedValue({ success: true });
      await getUserById(1);
      expect(mockFetchClient).toHaveBeenCalledWith('/users/1');
    });
  });

  describe('getAll', () => {
    it('should fetch users with pagination and filters', async () => {
      mockFetchClient.mockResolvedValue({ success: true });
      await getAll({ search: 'john', pagination: { offset: 0, limit: 10 } });
      expect(mockFetchClient).toHaveBeenCalledWith('/users?search=john&offset=0&limit=10');
    });

    it('should fetch users without params', async () => {
      mockFetchClient.mockResolvedValue({ success: true });
      await getAll();
      expect(mockFetchClient).toHaveBeenCalledWith('/users');
    });
  });

  describe('create', () => {
    it('should create user', async () => {
      const dto: CreateUserDto = {
        username: 'user',
        email: 'test@test',
        password: 'p',
        firstName: 'f',
        lastName: 'l',
        status: 'ACTIVE',
      };
      mockFetchClient.mockResolvedValue({ success: true });
      await create(dto);
      expect(mockFetchClient).toHaveBeenCalledWith('/users', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const dto: UpdateUserDto = { firstName: 'Updated' };
      mockFetchClient.mockResolvedValue({ success: true });
      await updateUser(1, dto);
      expect(mockFetchClient).toHaveBeenCalledWith('/users/1', {
        method: 'PATCH',
        body: JSON.stringify(dto),
      });
    });
  });
});
