import { AppResponse, UserWithRolesDto, UpdateUserDto } from '@sgcv2/shared';
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
};
