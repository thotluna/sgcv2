import { serverUsersService } from '@/lib/api/server-users.service';
import { UsersTable } from '@feature/users/components/admin/users-table';
import { DataPagination } from '@/components/data-pagination';
import { UserDto, UserFilterDto } from '@sgcv2/shared';

interface UsersTableContentProps {
  limit: number;
  offset: number;
  filter: UserFilterDto;
}

export async function UsersTableContent({ limit, offset, filter }: UsersTableContentProps) {
  let users: UserDto[] = [];
  let totalPages = 1;
  const currentPage = Math.floor(offset / limit) + 1;

  try {
    const response = await serverUsersService.getAll(filter);
    if (response.success) {
      users = response.data || [];
      totalPages = response.metadata?.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  const createPageUrl = (pageNumber: number) => {
    const newOffset = (pageNumber - 1) * limit;
    const urlParams = new URLSearchParams();

    if (filter.search && filter.search.toString() !== '') {
      urlParams.set('search', filter.search.toString());
    }

    if (filter.status && filter.status.toString() !== '') {
      urlParams.set('status', filter.status.toString());
    }

    if (newOffset > 0) {
      urlParams.set('offset', newOffset.toString());
    }

    if (limit !== 5) {
      urlParams.set('limit', limit.toString());
    }

    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '/users';
  };

  return (
    <>
      <UsersTable data={users} />
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
      />
    </>
  );
}
