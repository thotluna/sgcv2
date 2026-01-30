import { fetchClient } from '@lib/api/fetch-client';

import {
  AppResponse,
  CreateRoleDto,
  PermissionDto,
  RoleDto,
  RoleWithPermissionsDto,
  UpdateRoleDto,
} from '@sgcv2/shared';

export async function getAllRoles(
  page: number = 1,
  perPage: number = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  filters?: Record<string, string | number | boolean | undefined>
): Promise<AppResponse<RoleDto[]>> {
  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('limit', perPage.toString());

  if (sortBy) {
    params.append('sortBy', sortBy);

    if (sortOrder) {
      params.append('sortOrder', sortOrder);
    }
  }

  if (filters?.search) {
    params.append('search', String(filters.search));
  }

  const queryString = params.toString();
  const url = `/roles${queryString ? `?${queryString}` : ''}`;

  return fetchClient(url, {
    method: 'GET',
  });
}

export async function getRoleById(id: number): Promise<AppResponse<RoleWithPermissionsDto>> {
  return fetchClient(`/roles/${id}`, {
    method: 'GET',
  });
}

export async function createRole(data: CreateRoleDto): Promise<AppResponse<RoleDto>> {
  return fetchClient('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateRole(id: number, data: UpdateRoleDto): Promise<AppResponse<RoleDto>> {
  return fetchClient(`/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteRole(id: number): Promise<AppResponse<void>> {
  return fetchClient(`/roles/${id}`, {
    method: 'DELETE',
  });
}

export async function getAllPermissions(): Promise<AppResponse<PermissionDto[]>> {
  return fetchClient('/roles/permissions', {
    method: 'GET',
  });
}
