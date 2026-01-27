import { RoleDto, RoleFilterDto } from '@sgcv2/shared';

import { DataPagination } from '@/components/data-pagination';

import { getAllRoles } from '../service';
import { RolesTable } from './table';

interface RolesTableContentProps {
  limit: number;
  offset: number;
  filter: RoleFilterDto;
}

export async function RolesTableContent({ limit, offset, filter }: RolesTableContentProps) {
  let roles: RoleDto[] = [];
  let totalPages = 1;
  const currentPage = Math.floor(offset / limit) + 1;

  try {
    const response = await getAllRoles(filter);
    if (response?.success) {
      roles = response.data || [];
      totalPages = response.metadata?.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
  }

  const createPageUrl = (page: number) => {
    const newOffset = (page - 1) * limit;
    const urlParams = new URLSearchParams();

    if (filter.search && filter.search.toString() !== '') {
      urlParams.set('search', filter.search.toString());
    }

    if (newOffset > 0) {
      urlParams.set('offset', newOffset.toString());
    }

    if (limit !== 10) {
      urlParams.set('limit', limit.toString());
    }

    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '/roles';
  };

  return (
    <>
      <RolesTable data={roles} />
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
      />
    </>
  );
}
