jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

import {
  updateEmailAction,
  updatePasswordAction,
  updateAvatarAction,
  updateRoleAction,
} from '@feature/users/profile.actions';
import * as usersService from '@feature/users/service';
import { revalidatePath } from 'next/cache';

jest.mock('@feature/users/service');

describe('Profile Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateEmailAction', () => {
    it('should return success when update is successful', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateEmailAction(formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({ email: 'test@example.com' });
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
      (usersService.updateMe as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Email already exists' },
      });

      const result = await updateEmailAction(formData);
      expect(result).toEqual({ error: 'Email already exists' });
    });

    it('should handle unexpected errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      (usersService.updateMe as jest.Mock).mockRejectedValue(new Error('Boom'));

      const result = await updateEmailAction(formData);
      expect(result).toEqual({ error: 'An unexpected error occurred' });
    });
  });

  describe('updatePasswordAction', () => {
    it('should send current and new password to the service', async () => {
      const formData = new FormData();
      formData.append('currentPassword', 'oldPass123');
      formData.append('password', 'newPass123');
      formData.append('confirmPassword', 'newPass123');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updatePasswordAction(formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({
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
  });

  describe('updateAvatarAction', () => {
    it('should update avatar successfully', async () => {
      const formData = new FormData();
      formData.append('avatar', 'https://example.com/avatar.png');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateAvatarAction(formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({
        avatar: 'https://example.com/avatar.png',
      });
      expect(result).toEqual({ success: true });
    });

    it('should handle avatar validation failure', async () => {
      const formData = new FormData();
      formData.append('avatar', 'not-a-url');
      const result = await updateAvatarAction(formData);
      expect(result).toEqual({ error: 'Invalid data' });
    });

    it('should handle service error in avatar update', async () => {
      const formData = new FormData();
      formData.append('avatar', 'https://example.com/a.png');
      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: false });

      const result = await updateAvatarAction(formData);
      expect(result).toEqual({ error: 'Failed to update avatar' });
    });
  });

  describe('updateRoleAction', () => {
    it('should update roles successfully', async () => {
      const formData = new FormData();
      formData.append('roleIds', '1');
      formData.append('roleIds', '2');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateRoleAction(formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({
        roleIds: [1, 2],
      });
      expect(result).toEqual({ success: true });
    });

    it('should handle role validation failure', async () => {
      const formData = new FormData();
      formData.append('roleIds', 'not-a-number');
      const result = await updateRoleAction(formData);
      expect(result).toEqual({ error: 'Invalid role data' });
    });

    it('should handle role update error', async () => {
      const formData = new FormData();
      formData.append('roleIds', '1');
      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: false });

      const result = await updateRoleAction(formData);
      expect(result).toEqual({ error: 'Failed to update roles' });
    });
  });
});
