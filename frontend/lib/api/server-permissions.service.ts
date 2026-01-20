import { AppResponse, PermissionDto } from '@sgcv2/shared';
import { createServerApiClient } from './server-client';

export const serverPermissionsService = {
  getAll: async () => {
    const apiClient = await createServerApiClient();
    const response = await apiClient.get<AppResponse<PermissionDto[]>>('/roles/permissions');
    return response.data;
  },
};
