import { fetchClient } from '@lib/api/fetch-client';

import {
  AppResponse,
  CreateRoleDto,
  RoleDto,
  RoleFilterDto,
  RoleWithPermissionsDto,
  UpdateRoleDto,
} from '@sgcv2/shared';

export async function getAllRoles(filter?: RoleFilterDto): Promise<AppResponse<RoleDto[]>> {
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
