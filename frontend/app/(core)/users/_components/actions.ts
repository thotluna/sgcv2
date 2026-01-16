'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { serverUsersService } from '@/lib/api/server-users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from '@sgcv2/shared';
import * as z from 'zod';

const userSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Dirección de correo electrónico no válida'),
  password: z.string().optional().or(z.literal('')),
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  isActive: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
});

interface ApiResponseError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

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

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createUserAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = userSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    isActive: formData.get('isActive'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password, firstName, lastName, isActive } = validatedFields.data;

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
    isActive,
  };

  try {
    const response = await serverUsersService.create(data);

    if (response.success) {
      revalidatePath('/users');
    } else {
      return { success: false, message: response.error?.message || 'Error al crear usuario' };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    const message =
      (error as ApiResponseError).response?.data?.message || 'Error al conectar con el servidor';

    return {
      success: false,
      message,
    };
  }

  redirect('/users');
}

export async function updateUserAction(
  userId: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = userSchema.safeParse({
    username: 'dummy',
    email: formData.get('email'),
    password: formData.get('password'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    isActive: formData.get('isActive'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstName, lastName, isActive } = validatedFields.data;

  const data: UpdateUserDto = {
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    isActive,
  };

  if (password && password.trim() !== '') {
    data.password = password;
  }

  try {
    const response = await serverUsersService.updateUser(userId, data);

    if (response.success) {
      revalidatePath('/users');
    } else {
      return { success: false, message: response.error?.message || 'Error al actualizar usuario' };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    const message =
      (error as ApiResponseError).response?.data?.message || 'Error al conectar con el servidor';

    return {
      success: false,
      message,
    };
  }

  redirect('/users');
}

export async function getUser(id: number): Promise<ActionResult<UserDto>> {
  try {
    const response = await serverUsersService.getUserById(id);

    if (response.success) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'User not found' };
  } catch (error) {
    console.error('Error fetching user:', error);
    const errorMsg =
      (error as ApiResponseError).response?.data?.message || 'Error connecting to server';

    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function blockUserAction(userId: number): Promise<ActionResult<void>> {
  try {
    const response = await serverUsersService.updateUser(userId, {
      isActive: 'BLOCKED',
    } as UpdateUserDto);

    if (response.success) {
      revalidatePath('/users');
      return { success: true };
    }

    return { success: false, error: response.error?.message || 'Failed to block user' };
  } catch (error) {
    console.error('Error blocking user:', error);
    const errorMsg =
      (error as ApiResponseError).response?.data?.message || 'Error connecting to server';

    return {
      success: false,
      error: errorMsg,
    };
  }
}
