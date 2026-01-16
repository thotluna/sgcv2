jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

import {
  updateEmailAction,
  updatePasswordAction,
  updateAvatarAction,
  updateRoleAction,
} from '../profile.actions';
import { serverUsersService } from '@/lib/api/server-users.service';
import { revalidatePath } from 'next/cache';
import axios from 'axios';

jest.mock('@/lib/api/server-users.service');
jest.mock('axios');

describe('Profile Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAxiosError = (message: string) => {
    const error = new Error('Axios error') as any;
    error.isAxiosError = true;
    error.response = { data: { error: { message } } };
    return error;
  };

  describe('updateEmailAction', () => {
    it('should return success when update is successful', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      (serverUsersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateEmailAction(formData);

      expect(serverUsersService.updateMe).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(revalidatePath).toHaveBeenCalledWith('/users/profile');
      expect(result).toEqual({ success: true });
    });

    it('should return error on invalid data', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid');

      const result = await updateEmailAction(formData);

      expect(result).toEqual({ error: 'Invalid data' });
    });

    it('should handle service failure with message', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      (serverUsersService.updateMe as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Email already exists' },
      });

      const result = await updateEmailAction(formData);
      expect(result).toEqual({ error: 'Email already exists' });
    });

    it('should handle axios errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      const error = mockAxiosError('Server down');
      (serverUsersService.updateMe as jest.Mock).mockRejectedValue(error);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await updateEmailAction(formData);
      expect(result).toEqual({ error: 'Server down' });
    });

    it('should handle unexpected errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      (serverUsersService.updateMe as jest.Mock).mockRejectedValue(new Error('Boom'));
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);

      const result = await updateEmailAction(formData);
      expect(result).toEqual({ error: 'An unexpected error occurred' });
    });
  });

  describe('updatePasswordAction', () => {
    it('should send current and new password to the service', async () => {
      const formData = new FormData();
      formData.append('currentPassword', 'oldPass123');
      formData.append('newPassword', 'newPass123');
      formData.append('confirmPassword', 'newPass123');

      (serverUsersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updatePasswordAction(formData);

      expect(serverUsersService.updateMe).toHaveBeenCalledWith({
        password: 'newPass123',
        currentPassword: 'oldPass123',
      });
      expect(result).toEqual({ success: true });
    });

    it('should return error on validation failure', async () => {
      const formData = new FormData();
      const result = await updatePasswordAction(formData);
      expect(result).toEqual({ error: 'Invalid data' });
    });

    it('should handle axios errors in password update', async () => {
      const formData = new FormData();
      formData.append('currentPassword', 'oldPass123');
      formData.append('newPassword', 'newPass123');
      formData.append('confirmPassword', 'newPass123');

      const error = mockAxiosError('Wrong current password');
      (serverUsersService.updateMe as jest.Mock).mockRejectedValue(error);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await updatePasswordAction(formData);
      expect(result).toEqual({ error: 'Wrong current password' });
    });
  });

  describe('updateAvatarAction', () => {
    it('should update avatar successfully', async () => {
      const formData = new FormData();
      formData.append('avatarUrl', 'https://example.com/avatar.png');

      (serverUsersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateAvatarAction(formData);

      expect(serverUsersService.updateMe).toHaveBeenCalledWith({
        avatar: 'https://example.com/avatar.png',
      });
      expect(result).toEqual({ success: true });
    });

    it('should handle avatar validation failure', async () => {
      const formData = new FormData();
      formData.append('avatarUrl', 'not-a-url');
      const result = await updateAvatarAction(formData);
      expect(result).toEqual({ error: 'Invalid data' });
    });

    it('should handle service error in avatar update', async () => {
      const formData = new FormData();
      formData.append('avatarUrl', 'https://example.com/a.png');
      (serverUsersService.updateMe as jest.Mock).mockResolvedValue({ success: false });

      const result = await updateAvatarAction(formData);
      expect(result).toEqual({ error: 'Failed to update avatar' });
    });
  });

  describe('updateRoleAction', () => {
    it('should update roles successfully', async () => {
      const formData = new FormData();
      formData.append('roleIds', '1');
      formData.append('roleIds', '2');

      (serverUsersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateRoleAction(formData);

      expect(serverUsersService.updateMe).toHaveBeenCalledWith({
        roleIds: [1, 2],
      });
      expect(result).toEqual({ success: true });
    });

    it('should handle role validation failure', async () => {
      const formData = new FormData();
      // To trigger validation failure, we need to pass something that is not numbers or invalid format
      // but getAll('roleIds') always returns strings. If we pass nothing, it's an empty array.
      // UpdateRoleSchema is z.array(z.number())
      // If we pass a string that is not a number, map(Number) will return NaN.
      formData.append('roleIds', 'not-a-number');
      const result = await updateRoleAction(formData);
      expect(result).toEqual({ error: 'Invalid data' });
    });

    it('should handle role update error', async () => {
      const formData = new FormData();
      formData.append('roleIds', '1');
      (serverUsersService.updateMe as jest.Mock).mockResolvedValue({ success: false });

      const result = await updateRoleAction(formData);
      expect(result).toEqual({ error: 'Failed to update roles' });
    });
  });
});
