import { fetchClient } from '@lib/api/fetch-client';

import { AppResponse, PermissionDto } from '@sgcv2/shared';

export async function getAllPermissions(
  page: number = 1,
  perPage: number = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  filters?: Record<string, string | number | boolean | undefined>
): Promise<AppResponse<PermissionDto[]>> {
  const params = new URLSearchParams();

  params.append('page', page.toString() || '1');
  params.append('limit', perPage.toString() || '5');

  if (filters?.search) {
    params.append('search', String(filters.search));
  }

  if (sortBy) {
    params.append('sortBy', sortBy);
  }

  if (sortOrder) {
    params.append('sortOrder', sortOrder);
  }

  const queryString = params.toString();
  const url = `/permissions${queryString ? `?${queryString}` : ''}`;

  return fetchClient(url, {
    method: 'GET',
  });
}
