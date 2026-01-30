import { Suspense } from 'react';
import Link from 'next/link';

import { DataTable, TableSkeleton } from '@components/table-generic';
import { RolesFilters } from '@feature/roles/components';
import { columns } from '@feature/roles/components/columns';
import { getAllRoles } from '@feature/roles/service';

import { RoleFilterDto } from '@sgcv2/shared';

import { Button } from '@/components/ui/button';

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

        <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columns={3} />}>
          <DataTable fetchData={getAllRoles} headers={columns} searchParams={params} />
        </Suspense>
      </main>
    </div>
  );
}
