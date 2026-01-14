import {
  AppResponse,
  UserWithRolesDto,
  UpdateUserDto,
  UserFilterDto,
  UserDto,
} from '@sgcv2/shared';
import { createServerApiClient } from './server-client';

export const serverUsersService = {
  getMe: async () => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.get<AppResponse<UserWithRolesDto>>(`/users/me`);
    return response.data.data;
  },

  updateMe: async (data: UpdateUserDto) => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.patch<AppResponse<UserWithRolesDto>>(`/users/me`, data);
    return response.data;
  },

  getAll: async (filter?: UserFilterDto): Promise<AppResponse<UserDto[]>> => {
    const apiClient = await createServerApiClient();
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
    const apiClient = await createServerApiClient();
    const response = await apiClient.get<AppResponse<UserDto>>(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id: number, data: UpdateUserDto) => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.patch<AppResponse<UserDto>>(`/users/${id}`, data);
    return response.data;
  },
};
