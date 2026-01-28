import { fetchClient } from '@lib/api/fetch-client';

import { AppResponse, PermissionDto, PermissionFilterDto } from '@sgcv2/shared';

export async function getAllPermissions(
  filter?: PermissionFilterDto
): Promise<AppResponse<PermissionDto[]>> {
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
  const url = `/permissions${queryString ? `?${queryString}` : ''}`;

  return fetchClient(url, {
    method: 'GET',
  });
}
