'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateEmailSchema, updateAvatarSchema, updatePasswordBaseSchema } from '@sgcv2/shared';
import * as usersService from './service';

// Extend base password schema for UI confirmation
export const updatePasswordSchema = updatePasswordBaseSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine(
    (data: z.infer<typeof updatePasswordBaseSchema> & { confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

export async function updateEmailAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = updateEmailSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  try {
    const result = await usersService.updateMe({
      email: validated.data.email,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update email' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating email:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updatePasswordAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = updatePasswordSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  try {
    const result = await usersService.updateMe({
      password: validated.data.password,
      currentPassword: validated.data.currentPassword,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update password' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateAvatarAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  // Expecting 'avatar' field in formData to match shared schema
  const validated = updateAvatarSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  try {
    const result = await usersService.updateMe({
      avatar: validated.data.avatar,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update avatar' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating avatar:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateRoleAction(formData: FormData) {
  const roleIds = formData.getAll('roleIds').map(Number);

  if (roleIds.some(isNaN)) {
    return { error: 'Invalid role data' };
  }

  try {
    const result = await usersService.updateMe({
      roleIds,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update roles' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating roles:', error);
    return { error: 'An unexpected error occurred' };
  }
}
