import { apiClient } from './client';
import { User } from '@/types/auth';
import { AppResponse } from '@/types/response.type';

interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post<AppResponse<LoginResponse>>(`/auth/login`, {
      username,
      password,
    });
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post(`/auth/logout`);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get<AppResponse<User>>(`/users/me`);
    return response.data.data;
  },
};
