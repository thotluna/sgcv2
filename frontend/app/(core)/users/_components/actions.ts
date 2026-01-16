'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerApiClient } from '@/lib/api/server-client';
import { CreateUserDto, UpdateUserDto, UserDto, AppResponse } from '@sgcv2/shared';
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
    const apiClient = await createServerApiClient();
    const response = await apiClient.post('/users', data);

    if (response.status === 201 || response.status === 200) {
      revalidatePath('/users');
    } else {
      return { success: false, message: 'Respuesta inesperada del servidor' };
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
    const apiClient = await createServerApiClient();
    const response = await apiClient.patch(`/users/${userId}`, data);

    if (response.status === 200) {
      revalidatePath('/users');
    } else {
      return { success: false, message: 'Respuesta inesperada del servidor' };
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
    const apiClient = await createServerApiClient();
    const response = await apiClient.get<AppResponse<UserDto>>(`/users/${id}`);

    if (response.status === 200) {
      return { success: true, data: response.data.data };
    }

    return { success: false, error: 'User not found' };
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
