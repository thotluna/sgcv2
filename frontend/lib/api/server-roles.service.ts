import { AppResponse, RoleDto, RoleFilterDto } from '@sgcv2/shared';
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
};
