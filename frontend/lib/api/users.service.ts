import { AppResponse, UserWithRolesDto } from '@sgcv2/shared';
import { apiClient } from './client';

export const usersService = {
  getMe: async () => {
    const response = await apiClient.get<AppResponse<UserWithRolesDto>>(`/users/me`);
    return response.data.data;
  },
};
