import { ActionState } from '@lib/types';
import {
  updateEmailAction,
  updatePasswordAction,
  updateAvatarAction,
  updateRoleAction,
} from '@feature/users/profile.actions';
import * as usersService from '@feature/users/service';
import { revalidatePath } from 'next/cache';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@feature/users/service');

const initialState: ActionState = { success: false, message: '' };

describe('Profile Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('updateEmailAction', () => {
    it('should return success when update is successful', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateEmailAction(initialState, formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(revalidatePath).toHaveBeenCalledWith('/users/profile');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Correo actualizado con éxito');
    });

    it('should return error on invalid data', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid');

      const result = await updateEmailAction(initialState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('email');
    });

    it('should handle service failure with message', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      (usersService.updateMe as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Email already exists' },
      });

      const result = await updateEmailAction(initialState, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email already exists');
    });

    it('should handle unexpected errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      (usersService.updateMe as jest.Mock).mockRejectedValue(new Error('Boom'));

      const result = await updateEmailAction(initialState, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error inesperado al conectar con el servidor');
    });
  });

  describe('updatePasswordAction', () => {
    it('should send current and new password to the service', async () => {
      const formData = new FormData();
      formData.append('currentPassword', 'oldPass123');
      formData.append('password', 'newPass1234');
      formData.append('confirmPassword', 'newPass1234');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updatePasswordAction(initialState, formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({
        password: 'newPass1234',
        currentPassword: 'oldPass123',
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('Contraseña actualizada con éxito');
    });

    it('should return error on validation failure', async () => {
      const formData = new FormData();
      const result = await updatePasswordAction(initialState, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('password');
    });
  });

  describe('updateAvatarAction', () => {
    it('should update avatar successfully', async () => {
      const formData = new FormData();
      formData.append('avatar', 'https://example.com/avatar.png');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateAvatarAction(initialState, formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({
        avatar: 'https://example.com/avatar.png',
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('Avatar actualizado con éxito');
    });

    it('should handle avatar validation failure', async () => {
      const formData = new FormData();
      formData.append('avatar', 'not-a-url');
      const result = await updateAvatarAction(initialState, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(result.errors).toHaveProperty('avatar');
    });

    it('should handle service error in avatar update', async () => {
      const formData = new FormData();
      formData.append('avatar', 'https://example.com/a.png');
      (usersService.updateMe as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Failed to update avatar' },
      });

      const result = await updateAvatarAction(initialState, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to update avatar');
    });
  });

  describe('updateRoleAction', () => {
    it('should update roles successfully', async () => {
      const formData = new FormData();
      formData.append('roleIds', '1');
      formData.append('roleIds', '2');

      (usersService.updateMe as jest.Mock).mockResolvedValue({ success: true });

      const result = await updateRoleAction(initialState, formData);

      expect(usersService.updateMe).toHaveBeenCalledWith({
        roleIds: [1, 2],
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('Roles actualizados con éxito');
    });

    it('should handle role validation failure', async () => {
      const formData = new FormData();
      formData.append('roleIds', 'not-a-number');
      const result = await updateRoleAction(initialState, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Datos de roles inválidos');
    });

    it('should handle role update error', async () => {
      const formData = new FormData();
      formData.append('roleIds', '1');
      (usersService.updateMe as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Failed to update roles' },
      });

      const result = await updateRoleAction(initialState, formData);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to update roles');
    });
  });
});
