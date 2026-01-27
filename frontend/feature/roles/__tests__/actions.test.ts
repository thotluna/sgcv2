import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ActionState } from '@/lib/types';

import {
  createRoleAction,
  deleteRoleAction,
  handleRoleFilters,
  updateRoleAction,
} from '../actions';
import * as roleService from '../service';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('../service');

describe('Roles Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleRoleFilters', () => {
    it('should redirect with search param', async () => {
      const formData = new FormData();
      formData.append('search', 'admin');

      await handleRoleFilters(formData);

      expect(redirect).toHaveBeenCalledWith('/roles?search=admin');
    });

    it('should redirect without search if empty', async () => {
      const formData = new FormData();
      await handleRoleFilters(formData);
      expect(redirect).toHaveBeenCalledWith('/roles');
    });
  });

  describe('createRoleAction', () => {
    it('should create role and revalidate', async () => {
      const formData = new FormData();
      formData.append('name', 'New Role');
      formData.append('description', 'Desc');
      formData.append('permissionIds', '1');

      (roleService.createRole as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      const result = await createRoleAction(prevState, formData);

      expect(roleService.createRole).toHaveBeenCalledWith({
        name: 'New Role',
        description: 'Desc',
        permissionIds: [1],
      });
      expect(revalidatePath).toHaveBeenCalledWith('/roles');
      expect(result).toEqual({ success: true, message: 'Rol creado correctamente' });
    });

    it('should return validation error', async () => {
      const formData = new FormData();
      formData.append('name', ''); // Empty name should fail

      const prevState: ActionState = { success: false };
      const result = await createRoleAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error de validación');
      expect(roleService.createRole).not.toHaveBeenCalled();
    });

    it('should handle service error', async () => {
      const formData = new FormData();
      formData.append('name', 'Role');

      (roleService.createRole as jest.Mock).mockRejectedValue(new Error('API Error'));

      const prevState: ActionState = { success: false };
      const result = await createRoleAction(prevState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('API Error');
    });
  });

  describe('updateRoleAction', () => {
    it('should update role and revalidate', async () => {
      const formData = new FormData();
      formData.append('name', 'Updated Role');

      (roleService.updateRole as jest.Mock).mockResolvedValue({ success: true });

      const prevState: ActionState = { success: false };
      const result = await updateRoleAction(1, prevState, formData);

      expect(roleService.updateRole).toHaveBeenCalledWith(1, {
        name: 'Updated Role',
      });
      expect(revalidatePath).toHaveBeenCalledWith('/roles');
      expect(revalidatePath).toHaveBeenCalledWith('/roles/1');
      expect(result).toEqual({ success: true, message: 'Rol actualizado correctamente' });
    });
  });

  describe('deleteRoleAction', () => {
    it('should delete role and revalidate', async () => {
      (roleService.deleteRole as jest.Mock).mockResolvedValue({ success: true });

      const result = await deleteRoleAction(1);

      expect(roleService.deleteRole).toHaveBeenCalledWith(1);
      expect(revalidatePath).toHaveBeenCalledWith('/roles');
      expect(result).toEqual({ success: true, message: 'Rol eliminado correctamente' });
    });
  });
});
