import { Suspense } from 'react';
import Link from 'next/link';

import { UsersFilters } from '@feature/users/components/admin/filters';
import { columns } from '@feature/users/components/admin/users-columns';
import { getAllUsers } from '@feature/users/service';

import { UserStatus } from '@sgcv2/shared';

import { DataTable, TableSkeleton } from '@/components/table-generic';
import { Button } from '@/components/ui/button';

interface UsersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

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
        <UsersFilters
          search={typeof params.search === 'string' ? params.search : undefined}
          status={typeof params.status === 'string' ? (params.status as UserStatus) : undefined}
        />

        <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columns={5} />}>
          <DataTable fetchData={getAllUsers} headers={columns} searchParams={params} />
        </Suspense>
      </main>
    </div>
  );
}
