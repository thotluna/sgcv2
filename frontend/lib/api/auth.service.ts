import { apiClient } from './client';
import { User } from '@/types/auth';

interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post<LoginResponse>(`/auth/login`, { username, password });
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post(`/auth/logout`);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get<User>(`/users/me`);
    return response.data;
  },
};
