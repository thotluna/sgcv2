'use server';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { redirect } from 'next/navigation';
import { createServerApiClient } from '@/lib/api/server-client';
import { CreateUserDto, UpdateUserDto, UserDto, AppResponse } from '@sgcv2/shared';

export type ActionResult<T = any> = {
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

export async function createUser(data: CreateUserDto): Promise<ActionResult> {
  try {
    const apiClient = await createServerApiClient();
    const response = await apiClient.post('/users', data);

    if (response.status === 201 || response.status === 200) {
      return { success: true };
    }

    return { success: false, error: 'Unexpected response from server' };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error connecting to server',
    };
  }
}

export async function updateUser(id: number, data: UpdateUserDto): Promise<ActionResult> {
  try {
    const apiClient = await createServerApiClient();
    const response = await apiClient.patch(`/users/${id}`, data);

    if (response.status === 200) {
      return { success: true };
    }

    return { success: false, error: 'Unexpected response from server' };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error connecting to server',
    };
  }
}

export async function getUser(id: number): Promise<ActionResult<UserDto>> {
  try {
    const apiClient = await createServerApiClient();
    const response = await apiClient.get<AppResponse<UserDto>>(`/users/${id}`);

    if (response.status === 200) {
      return { success: true, data: response.data.data };
    }

    return { success: false, error: 'User not found' };
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error connecting to server',
    };
  }
}
