import { createUserAction, updateUserAction, getUser, ActionState } from '../actions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/lib/api/server-users.service', () => ({
  serverUsersService: {
    create: jest.fn(),
    updateUser: jest.fn(),
    getUserById: jest.fn(),
  },
}));

import { serverUsersService } from '@/lib/api/server-users.service';

describe('User Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      (serverUsersService.create as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      await createUserAction(prevState, formData);

      expect(serverUsersService.create).toHaveBeenCalledWith(
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

      const prevState: ActionState = { success: false };
      const result = await createUserAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('username');
      expect(result.errors).toHaveProperty('email');
      expect(serverUsersService.create).not.toHaveBeenCalled();
    });

    it('should return error when password is missing for new user', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('isActive', 'ACTIVE');
      formData.append('password', '');
      formData.append('firstName', '');
      formData.append('lastName', '');

      const prevState: ActionState = { success: false };
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

      (serverUsersService.create as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Username already exists' },
      });

      const prevState: ActionState = { success: false };
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

      (serverUsersService.create as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Respuesta inesperada del servidor' },
      });

      const prevState: ActionState = { success: false };
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

      (serverUsersService.updateUser as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      await updateUserAction(123, prevState, formData);

      expect(serverUsersService.updateUser).toHaveBeenCalledWith(
        123,
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

      (serverUsersService.updateUser as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      await updateUserAction(123, prevState, formData);

      expect(serverUsersService.updateUser).toHaveBeenCalledWith(
        123,
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

      (serverUsersService.updateUser as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Conflict' },
      });

      const prevState: ActionState = { success: false };
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

      (serverUsersService.updateUser as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Respuesta inesperada del servidor' },
      });

      const prevState: ActionState = { success: false };
      const result = await updateUserAction(123, prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Respuesta inesperada del servidor');
    });

    it('should return validation errors when update data is invalid', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');

      const prevState: ActionState = { success: false };
      const result = await updateUserAction(123, prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('email');
    });
  });

  describe('getUser', () => {
    it('should fetch user data successfully', async () => {
      const mockUser = { id: 123, username: 'testuser' };
      (serverUsersService.getUserById as jest.Mock).mockResolvedValue({
        success: true,
        data: mockUser,
      });

      const result = await getUser(123);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      (serverUsersService.getUserById as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'User not found' },
      });

      const result = await getUser(123);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should handle API error when fetching user', async () => {
      (serverUsersService.getUserById as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Network Error' },
      });

      const result = await getUser(123);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
    });
  });
});
