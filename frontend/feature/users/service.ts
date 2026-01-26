import { fetchClient } from '@/lib/api/fetch-client';
import {
  AppResponse,
  CreateUserDto,
  UserDto,
  UserWithRolesDto,
  UpdateUserDto,
  UserFilterDto,
} from '@sgcv2/shared';

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

export async function getAll(filter?: UserFilterDto): Promise<AppResponse<UserDto[]>> {
  const { pagination, ...rest } = filter || {};
  const params = new URLSearchParams();

  if (rest) {
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
    });
  }

  if (pagination) {
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
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
