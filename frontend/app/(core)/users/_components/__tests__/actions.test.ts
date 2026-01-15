import { createUserAction, updateUserAction, getUser, ActionState } from '../actions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerApiClient } from '@/lib/api/server-client';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/lib/api/server-client', () => ({
  createServerApiClient: jest.fn(),
}));

describe('User Actions', () => {
  const mockApiClient = {
    post: jest.fn(),
    patch: jest.fn(),
    get: jest.fn(),
  };

  const prevState: ActionState = { success: false };

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerApiClient as jest.Mock).mockResolvedValue(mockApiClient);
  });

  describe('handleUserFilters', () => {
    const { handleUserFilters } = jest.requireActual('../actions');

    it('should redirect with search and status params', async () => {
      const formData = new FormData();
      formData.append('search', 'john');
      formData.append('status', 'ACTIVE');

      await handleUserFilters(formData);

      expect(redirect).toHaveBeenCalledWith('/users?search=john&status=ACTIVE');
    });

    it('should redirect without search if empty', async () => {
      const formData = new FormData();
      formData.append('search', '  ');
      formData.append('status', 'INACTIVE');

      await handleUserFilters(formData);

      expect(redirect).toHaveBeenCalledWith('/users?status=INACTIVE');
    });

    it('should redirect with /users when no filters', async () => {
      const formData = new FormData();
      await handleUserFilters(formData);
      expect(redirect).toHaveBeenCalledWith('/users');
    });
  });

  describe('createUserAction', () => {
    it('should create user successfully and redirect', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('isActive', 'ACTIVE');
      formData.append('firstName', '');
      formData.append('lastName', '');

      mockApiClient.post.mockResolvedValue({ status: 201 });

      await createUserAction(prevState, formData);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          isActive: 'ACTIVE',
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith('/users');
      expect(redirect).toHaveBeenCalledWith('/users');
    });

    it('should return validation errors when data is invalid', async () => {
      const formData = new FormData();
      formData.append('username', 'te'); // Too short
      formData.append('email', 'invalid-email');

      const result = await createUserAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('username');
      expect(result.errors).toHaveProperty('email');
      expect(mockApiClient.post).not.toHaveBeenCalled();
    });

    it('should return error when password is missing for new user', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('isActive', 'ACTIVE');
      formData.append('password', '');
      formData.append('firstName', '');
      formData.append('lastName', '');

      const result = await createUserAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('La contraseña es obligatoria para nuevos usuarios');
    });

    it('should handle API errors', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('isActive', 'ACTIVE');
      formData.append('firstName', '');
      formData.append('lastName', '');

      const apiError = {
        response: {
          data: {
            message: 'Username already exists',
          },
        },
      };
      mockApiClient.post.mockRejectedValue(apiError);

      const result = await createUserAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Username already exists');
    });

    it('should return error on unexpected status code', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('isActive', 'ACTIVE');
      formData.append('firstName', '');
      formData.append('lastName', '');

      mockApiClient.post.mockResolvedValue({ status: 400 });

      const result = await createUserAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Respuesta inesperada del servidor');
    });
  });

  describe('updateUserAction', () => {
    it('should update user successfully and redirect', async () => {
      const formData = new FormData();
      formData.append('email', 'updated@example.com');
      formData.append('isActive', 'INACTIVE');
      formData.append('firstName', 'New');
      formData.append('lastName', 'Name');
      formData.append('password', '');

      mockApiClient.patch.mockResolvedValue({ status: 200 });

      await updateUserAction(123, prevState, formData);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/users/123',
        expect.objectContaining({
          email: 'updated@example.com',
          isActive: 'INACTIVE',
          firstName: 'New',
          lastName: 'Name',
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith('/users');
      expect(redirect).toHaveBeenCalledWith('/users');
    });

    it('should include password in update if provided', async () => {
      const formData = new FormData();
      formData.append('email', 'updated@example.com');
      formData.append('isActive', 'ACTIVE');
      formData.append('password', 'newpassword123');
      formData.append('firstName', '');
      formData.append('lastName', '');

      mockApiClient.patch.mockResolvedValue({ status: 200 });

      await updateUserAction(123, prevState, formData);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/users/123',
        expect.objectContaining({
          password: 'newpassword123',
        })
      );
    });

    it('should handle API errors during update', async () => {
      const formData = new FormData();
      formData.append('email', 'updated@example.com');
      formData.append('isActive', 'ACTIVE');
      formData.append('password', '');
      formData.append('firstName', '');
      formData.append('lastName', '');

      mockApiClient.patch.mockRejectedValue({
        response: { data: { message: 'Conflict' } },
      });

      const result = await updateUserAction(123, prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Conflict');
    });

    it('should handle unexpected status code during update', async () => {
      const formData = new FormData();
      formData.append('email', 'updated@example.com');
      formData.append('isActive', 'ACTIVE');
      formData.append('password', '');
      formData.append('firstName', '');
      formData.append('lastName', '');

      mockApiClient.patch.mockResolvedValue({ status: 404 });

      const result = await updateUserAction(123, prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Respuesta inesperada del servidor');
    });

    it('should return validation errors when update data is invalid', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');

      const result = await updateUserAction(123, prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('email');
    });
  });

  describe('getUser', () => {
    it('should fetch user data successfully', async () => {
      const mockUser = { id: 123, username: 'testuser' };
      mockApiClient.get.mockResolvedValue({
        status: 200,
        data: { data: mockUser },
      });

      const result = await getUser(123);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      mockApiClient.get.mockResolvedValue({ status: 404 });

      const result = await getUser(123);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should handle API error when fetching user', async () => {
      mockApiClient.get.mockRejectedValue({
        response: { data: { message: 'Network Error' } },
      });

      const result = await getUser(123);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
    });
  });
});
