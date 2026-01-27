import {
  AppResponse,
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserFilterDto,
  UserWithRolesDto,
} from '@sgcv2/shared';

import { apiClient } from './client';

export const usersService = {
  getMe: async () => {
    const response = await apiClient.get<AppResponse<UserWithRolesDto>>(`/users/me`);
    return response.data;
  },

  updateMe: async (data: UpdateUserDto) => {
    const response = await apiClient.patch<AppResponse<UserWithRolesDto>>(`/users/me`, data);
    return response.data;
  },

  getAll: async (filter?: UserFilterDto): Promise<AppResponse<UserDto[]>> => {
    const { pagination, ...rest } = filter || {};
    const response = await apiClient.get<AppResponse<UserDto[]>>(`/users`, {
      params: {
        ...rest,
        ...pagination,
      },
    });
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await apiClient.get<AppResponse<UserDto>>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserDto) => {
    const response = await apiClient.patch<AppResponse<UserDto>>(`/users/${id}`, data);
    return response.data;
  },

  create: async (data: CreateUserDto) => {
    const response = await apiClient.post<AppResponse<UserDto>>(`/users`, data);
    return response.data;
  },
};
