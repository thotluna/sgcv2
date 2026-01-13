'use server';

import { revalidatePath } from 'next/cache';
import {
  UpdateEmailSchema,
  UpdatePasswordSchema,
  UpdateAvatarSchema,
  UpdateRoleSchema,
} from '../_schemas/profile.schema';
import { serverUsersService } from '@/lib/api/server-users.service';
import axios from 'axios';

export async function updateEmailAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = UpdateEmailSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  try {
    const result = await serverUsersService.updateMe({
      email: validated.data.email,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update email' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error?.message || 'Server error' };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function updatePasswordAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = UpdatePasswordSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  try {
    const result = await serverUsersService.updateMe({
      password: validated.data.newPassword,
      currentPassword: validated.data.currentPassword,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update password' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error?.message || 'Server error' };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateAvatarAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = UpdateAvatarSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  try {
    const result = await serverUsersService.updateMe({
      avatar: validated.data.avatarUrl,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update avatar' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error?.message || 'Server error' };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateRoleAction(formData: FormData) {
  const roleIds = formData.getAll('roleIds').map(Number);
  const validated = UpdateRoleSchema.safeParse({ roleIds });

  if (!validated.success) {
    return { error: 'Invalid data' };
  }

  try {
    const result = await serverUsersService.updateMe({
      roleIds: validated.data.roleIds,
    });

    if (!result.success) {
      return { error: result.error?.message || 'Failed to update roles' };
    }

    revalidatePath('/users/profile');
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.error?.message || 'Server error' };
    }
    return { error: 'An unexpected error occurred' };
  }
}
