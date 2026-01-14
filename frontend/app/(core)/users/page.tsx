import { serverUsersService } from '@/lib/api/server-users.service';
import { UsersTable } from './_components/table';
import { UsersFilters } from './_components/filters';
import { UserDto, UserFilterDto, UserStatus } from '@sgcv2/shared';
import { DataPagination } from '@/components/data-pagination';

interface UsersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 20;
  const offset = typeof params.offset === 'string' ? parseInt(params.offset) : 0;

  const filter: UserFilterDto = {
    search: typeof params.search === 'string' ? params.search : undefined,
    status: typeof params.status === 'string' ? (params.status as UserStatus) : undefined,
    pagination: {
      limit,
      offset,
    },
  };

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

  const createPageUrl = (page: number) => {
    const newOffset = (page - 1) * limit;
    const searchParams = new URLSearchParams();

    if (params.search && params.search.toString() !== '') {
      searchParams.set('search', params.search.toString());
    }

    if (params.status && params.status.toString() !== '') {
      searchParams.set('status', params.status.toString());
    }

    if (newOffset > 0) {
      searchParams.set('offset', newOffset.toString());
    }

    if (limit !== 20) {
      searchParams.set('limit', limit.toString());
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '/users';
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios del sistema y sus permisos.</p>
      </div>

      <UsersFilters search={filter.search} status={filter.status} />

      <UsersTable data={users} />

      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
      />
    </div>
  );
}