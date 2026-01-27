'use server';

import { revalidatePath } from 'next/cache';

import { ActionState } from '@lib/types';

import { updateAvatarSchema, updateEmailSchema } from '@sgcv2/shared';

import { updatePasswordSchema } from './schemas';
import * as usersService from './service';

export async function updateEmailAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);
  const validated = updateEmailSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await usersService.updateMe({
      email: validated.data.email,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error?.message || 'Error al actualizar el correo',
      };
    }

    revalidatePath('/users/profile');
    return { success: true, message: 'Correo actualizado con éxito' };
  } catch (error) {
    console.error('Error updating email:', error);
    return {
      success: false,
      message: 'Error inesperado al conectar con el servidor',
    };
  }
}

export async function updatePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);
  const validated = updatePasswordSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await usersService.updateMe({
      password: validated.data.password,
      currentPassword: validated.data.currentPassword,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error?.message || 'Error al actualizar la contraseña',
      };
    }

    revalidatePath('/users/profile');
    return { success: true, message: 'Contraseña actualizada con éxito' };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      message: 'Error inesperado al conectar con el servidor',
    };
  }
}

export async function updateAvatarAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);
  const validated = updateAvatarSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await usersService.updateMe({
      avatar: validated.data.avatar,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error?.message || 'Error al actualizar el avatar',
      };
    }

    revalidatePath('/users/profile');
    return { success: true, message: 'Avatar actualizado con éxito' };
  } catch (error) {
    console.error('Error updating avatar:', error);
    return {
      success: false,
      message: 'Error inesperado al conectar con el servidor',
    };
  }
}

export async function updateRoleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const roleIds = formData.getAll('roleIds').map(Number);

  if (roleIds.some(isNaN)) {
    return { success: false, message: 'Datos de roles inválidos' };
  }

  try {
    const result = await usersService.updateMe({
      roleIds,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error?.message || 'Error al actualizar roles',
      };
    }

    revalidatePath('/users/profile');
    return { success: true, message: 'Roles actualizados con éxito' };
  } catch (error) {
    console.error('Error updating roles:', error);
    return {
      success: false,
      message: 'Error inesperado al conectar con el servidor',
    };
  }
}
