import { Suspense } from 'react';
import { Metadata } from 'next';

import { PermissionsFilters } from '@feature/permissions/components';
import { columns } from '@feature/permissions/components/permissions-columns';
import { getAllPermissions } from '@feature/permissions/service';

import { DataTable, TableSkeleton } from '@/components/table-generic';

export const metadata: Metadata = {
  title: 'Permisos | SGCV2',
  description: 'Gestión de permisos del sistema',
};

interface PermissionsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    perPage?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>;
}

export default async function PermissionsPage({ searchParams }: PermissionsPageProps) {
  const params = await searchParams;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Permisos</h1>
        <p className="text-muted-foreground">
          Consulta y gestiona los permisos disponibles en el sistema.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PermissionsFilters search={params.search} />

        <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columns={3} />}>
          <DataTable fetchData={getAllPermissions} headers={columns} searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}
