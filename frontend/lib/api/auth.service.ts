import { apiClient } from './client';
import { User } from '@/types/auth';

interface LoginResponse {
  user: User;
  token: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  metadata: any;
}

export const authService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(`/auth/login`, {
      username,
      password,
    });
    return response.data.data;
  },
  logout: async () => {
    const response = await apiClient.post(`/auth/logout`);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/me`);
    return response.data.data;
  },
};
