'use server';

import { ActionState } from '@lib/types';
import {
  CreateUserDto,
  UpdateUserDto,
  AppResponse,
  UserDto,
  createUserSchema,
  updateUserSchema,
} from '@sgcv2/shared';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as usersService from './service';

export async function handleUserFilters(formData: FormData) {
  const search = formData.get('search') as string;
  const status = formData.get('status') as string;

  const params = new URLSearchParams();

  if (search && search.trim() !== '') {
    params.set('search', search.trim());
  }

  if (status && status !== '') {
    params.set('status', status);
  }

  const queryString = params.toString();
  redirect(`/users${queryString ? `?${queryString}` : ''}`);
}

export async function createUserAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = createUserSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password, firstName, lastName, status } = validatedFields.data;

  if (!password) {
    return {
      success: false,
      message: 'La contraseña es obligatoria para nuevos usuarios',
      errors: { password: ['La contraseña es obligatoria'] },
    };
  }

  const data: CreateUserDto = {
    username,
    email,
    password,
    firstName: firstName || '',
    lastName: lastName || '',
    status,
  };

  try {
    const response = await usersService.create(data);

    if (response.success) {
      revalidatePath('/users');
    } else {
      return { success: false, message: response.error?.message || 'Error al crear usuario' };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }

  redirect('/users');
}

export async function updateUserAction(
  userId: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const formDataEmail = formData.get('email') as string;
  const formDataPassword = formData.get('password') as string;
  const formDataFirstName = formData.get('firstName') as string;
  const formDataLastName = formData.get('lastName') as string;
  const formDataStatus = formData.get('status') as string;

  const validatedFields = updateUserSchema.safeParse({
    email: formDataEmail,
    password: formDataPassword || undefined,
    firstName: formDataFirstName || undefined,
    lastName: formDataLastName || undefined,
    status: formDataStatus || undefined,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstName, lastName, status } = validatedFields.data;

  const data: UpdateUserDto = {
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    status,
  };

  if (password && password.trim() !== '') {
    data.password = password;
  }

  try {
    const response = await usersService.updateUser(userId, data);

    if (response.success) {
      revalidatePath('/users');
    } else {
      return { success: false, message: response.error?.message || 'Error al actualizar usuario' };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }

  redirect('/users');
}

export async function getUser(id: number): Promise<AppResponse<UserDto>> {
  try {
    return await usersService.getUserById(id);
  } catch (error) {
    console.error('Error fetching user:', error);
    const message = 'Error connecting to server';

    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message,
      },
    };
  }
}

export async function blockUserAction(userId: number): Promise<AppResponse<void>> {
  try {
    const response = await usersService.updateUser(userId, {
      status: 'BLOCKED',
    } as UpdateUserDto);

    if (response.success) {
      revalidatePath('/users');
      return { success: true };
    }

    return {
      success: false,
      error: response.error || { code: 'BLOCK_ERROR', message: 'Failed to block user' },
    };
  } catch (error) {
    console.error('Error blocking user:', error);
    const message = 'Error connecting to server';

    return {
      success: false,
      error: {
        code: 'ACTION_ERROR',
        message,
      },
    };
  }
}
