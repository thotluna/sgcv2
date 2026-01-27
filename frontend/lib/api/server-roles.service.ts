import {
  AppResponse,
  CreateRoleDto,
  PermissionDto,
  RoleDto,
  RoleFilterDto,
  RoleWithPermissionsDto,
  UpdateRoleDto,
} from '@sgcv2/shared';

import { createServerApiClient } from './server-client';

export const serverRolesService = {
  getAll: async (filter?: RoleFilterDto) => {
    const apiClient = await createServerApiClient();
    const params = new URLSearchParams();

    if (filter?.search) {
      params.append('search', filter.search);
    }

    if (filter?.pagination) {
      const page = Math.floor(filter.pagination.offset / filter.pagination.limit) + 1;
      params.append('page', page.toString());
      params.append('limit', filter.pagination.limit.toString());
    }

    const queryString = params.toString();
    const url = `/roles${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<AppResponse<RoleDto[]>>(url);
    return response.data;
  },

  getById: async (id: number) => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.get<AppResponse<RoleWithPermissionsDto>>(`/roles/${id}`);
    return response.data;
  },

  create: async (data: CreateRoleDto) => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.post<AppResponse<RoleDto>>('/roles', data);
    return response.data;
  },

  update: async (id: number, data: UpdateRoleDto) => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.patch<AppResponse<RoleDto>>(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.delete<AppResponse<void>>(`/roles/${id}`);
    return response.data;
  },
  getAllPermissions: async () => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.get<AppResponse<PermissionDto[]>>('/roles/permissions');
    return response.data;
  },
};
