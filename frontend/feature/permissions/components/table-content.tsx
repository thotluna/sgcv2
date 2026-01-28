import { PermissionDto, PermissionFilterDto } from '@sgcv2/shared';

import { DataPagination } from '@/components/data-pagination';

import { getAllPermissions } from '../service';
import { PermissionsTable } from './permissions-table';

interface PermissionsTableContentProps {
  limit: number;
  offset: number;
  filter: PermissionFilterDto;
}

export async function PermissionsTableContent({
  limit,
  offset,
  filter,
}: PermissionsTableContentProps) {
  let permissions: PermissionDto[] = [];
  let totalPages = 1;
  const currentPage = Math.floor(offset / limit) + 1;

  try {
    const response = await getAllPermissions(filter);
    if (response.success) {
      permissions = response.data || [];
      // Backend PermissionsController doesn't support total yet, but we'll use metadata if available
      totalPages = response.metadata?.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }

  const createPageUrl = (pageNumber: number) => {
    const newOffset = (pageNumber - 1) * limit;
    const urlParams = new URLSearchParams();

    if (filter.search) {
      urlParams.set('search', filter.search);
    }

    if (newOffset > 0) {
      urlParams.set('offset', newOffset.toString());
    }

    if (limit !== 10) {
      urlParams.set('limit', limit.toString());
    }

    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '/permissions';
  };

  return (
    <div className="space-y-4">
      <PermissionsTable data={permissions} />
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
      />
    </div>
  );
}
