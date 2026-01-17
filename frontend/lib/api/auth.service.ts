import { apiClient } from './client';
import { LoginDto, AppResponse, AuthenticatedUserDto } from '@sgcv2/shared';

interface LoginResponse {
  user: AuthenticatedUserDto;
  token?: string;
}

export const authService = {
  login: async (username: string, password: string) => {
    const loginDto: LoginDto = {
      username,
      password,
    };
    const response = await apiClient.post<AppResponse<LoginResponse>>(`/auth/login`, loginDto);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post(`/auth/logout`);
    return response.data;
  },
};
