import {
  AppResponse,
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserWithRolesDto,
} from '@sgcv2/shared';

import { fetchClient } from '@/lib/api/fetch-client';

export async function getMe(): Promise<AppResponse<UserWithRolesDto>> {
  return fetchClient('/users/me', {
    method: 'GET',
  });
}

export async function updateMe(data: UpdateUserDto): Promise<AppResponse<UserWithRolesDto>> {
  return fetchClient('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getUserById(id: number): Promise<AppResponse<UserDto>> {
  return fetchClient(`/users/${id}`);
}

export async function getAllUsers(
  page: number = 1,
  perPage: number = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  filters?: Record<string, string | number | boolean | undefined>
): Promise<AppResponse<UserDto[]>> {
  const params = new URLSearchParams();

  const offset = (page - 1) * perPage;
  params.append('offset', offset.toString());
  params.append('limit', perPage.toString());

  if (sortBy) {
    params.append('sortBy', sortBy);
    if (sortOrder) {
      params.append('sortOrder', sortOrder);
    }
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        key !== 'page' &&
        key !== 'limit' &&
        key !== 'offset' &&
        key !== 'sortBy' &&
        key !== 'sortOrder'
      ) {
        params.append(key, String(value));
      }
    });
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return fetchClient(`/users${query}`);
}

export async function create(data: CreateUserDto): Promise<AppResponse<UserDto>> {
  return fetchClient('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number, data: UpdateUserDto): Promise<AppResponse<UserDto>> {
  return fetchClient(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
