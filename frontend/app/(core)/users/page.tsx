import { Suspense } from 'react';
import Link from 'next/link';

import { UsersFilters } from '@feature/users/components/admin/filters';

import { UserFilterDto, UserStatus } from '@sgcv2/shared';

import { TableSkeleton } from '@/components/table/table-skeleton';
import { Button } from '@/components/ui/button';

import { UsersTableContent } from './_components/table-content';

interface UsersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 5;
  const offset = typeof params.offset === 'string' ? parseInt(params.offset) : 0;

  const filter: UserFilterDto = {
    search: typeof params.search === 'string' ? params.search : undefined,
    status: typeof params.status === 'string' ? (params.status as UserStatus) : undefined,
    pagination: {
      limit,
      offset,
    },
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Gestiona los usuarios del sistema y sus permisos.</p>
        </div>
        <Button asChild>
          <Link href="/users/new">Crear Usuario</Link>
        </Button>
      </header>

      <main className="flex w-full flex-col gap-4">
        <UsersFilters search={filter.search} status={filter.status} />

        <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columnCount={4} />}>
          <UsersTableContent limit={limit} offset={offset} filter={filter} />
        </Suspense>
      </main>
    </div>
  );
}
