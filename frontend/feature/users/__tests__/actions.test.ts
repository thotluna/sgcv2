import { createUserAction, updateUserAction, getUser } from '@feature/users/actions';
import { ActionState } from '@lib/types';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import * as usersService from '@feature/users/service';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@feature/users/service');

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
      formData.append('status', 'ACTIVE');
      formData.append('firstName', '');
      formData.append('lastName', '');

      (usersService.create as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      await createUserAction(prevState, formData);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          status: 'ACTIVE',
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
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('should return validation errors when password is missing for new user', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('status', 'ACTIVE');
      formData.append('password', '');
      formData.append('firstName', '');
      formData.append('lastName', '');

      const prevState: ActionState = { success: false };
      const result = await createUserAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('password');
    });

    it('should handle API errors', async () => {
      const formData = new FormData();
      formData.append('username', 'testuser');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('status', 'ACTIVE');
      formData.append('firstName', '');
      formData.append('lastName', '');

      (usersService.create as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Username already exists' },
      });

      const prevState: ActionState = { success: false };
      const result = await createUserAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Username already exists');
    });
  });

  describe('updateUserAction', () => {
    it('should update user successfully and redirect', async () => {
      const formData = new FormData();
      formData.append('email', 'updated@example.com');
      formData.append('status', 'INACTIVE');
      formData.append('firstName', 'New');
      formData.append('lastName', 'Name');
      formData.append('password', '');

      (usersService.updateUser as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      await updateUserAction(123, prevState, formData);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          email: 'updated@example.com',
          status: 'INACTIVE',
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
      formData.append('status', 'ACTIVE');
      formData.append('password', 'newpassword123');
      formData.append('firstName', '');
      formData.append('lastName', '');

      (usersService.updateUser as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      await updateUserAction(123, prevState, formData);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          password: 'newpassword123',
        })
      );
    });

    it('should handle API errors during update', async () => {
      const formData = new FormData();
      formData.append('email', 'updated@example.com');
      formData.append('status', 'ACTIVE');
      formData.append('password', '');
      formData.append('firstName', '');
      formData.append('lastName', '');

      (usersService.updateUser as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Conflict' },
      });

      const prevState: ActionState = { success: false };
      const result = await updateUserAction(123, prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Conflict');
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
      (usersService.getUserById as jest.Mock).mockResolvedValue({
        success: true,
        data: mockUser,
      });

      const result = await getUser(123);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it('should handle API failure when fetching user', async () => {
      (usersService.getUserById as jest.Mock).mockRejectedValue(new Error('Boom'));

      const result = await getUser(123);

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        code: 'FETCH_ERROR',
        message: 'Error connecting to server',
      });
    });
  });
});
