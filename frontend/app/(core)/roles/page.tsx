import { serverRolesService } from '@/lib/api/server-roles.service';
import { RolesTable } from './_components/table';
import { RolesFilters } from './_components/filters';
import { RoleDto, RoleFilterDto } from '@sgcv2/shared';
import { DataPagination } from '@/components/data-pagination';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RolesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RolesPage({ searchParams }: RolesPageProps) {
  const params = await searchParams;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 10;
  const offset = typeof params.offset === 'string' ? parseInt(params.offset) : 0;

  const filter: RoleFilterDto = {
    search: typeof params.search === 'string' ? params.search : undefined,
    pagination: {
      limit,
      offset,
    },
  };

  let roles: RoleDto[] = [];
  let totalPages = 1;
  const currentPage = Math.floor(offset / limit) + 1;

  try {
    const response = await serverRolesService.getAll(filter);
    if (response?.success) {
      roles = response.data || [];
      totalPages = response.metadata?.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
  }

  const createPageUrl = (page: number) => {
    const newOffset = (page - 1) * limit;
    const searchParams = new URLSearchParams();

    if (params.search && params.search.toString() !== '') {
      searchParams.set('search', params.search.toString());
    }

    if (newOffset > 0) {
      searchParams.set('offset', newOffset.toString());
    }

    if (limit !== 10) {
      searchParams.set('limit', limit.toString());
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '/roles';
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Gestiona los roles del sistema y sus permisos asociados.
          </p>
        </div>
        <Button asChild>
          <Link href="/roles/new">Crear Rol</Link>
        </Button>
      </header>

      <main className="flex w-full flex-col gap-4">
        <RolesFilters search={filter.search} />

        <RolesTable data={roles} />

        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          createPageUrl={createPageUrl}
        />
      </main>
    </div>
  );
}
