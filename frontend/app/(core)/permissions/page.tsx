import { Suspense } from 'react';
import { Metadata } from 'next';

import { PermissionsFilters, PermissionsTableContent } from '@feature/permissions/components';

import { PermissionFilterDto } from '@sgcv2/shared';

import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Permisos | SGCV2',
  description: 'Gestión de permisos del sistema',
};

interface PermissionsPageProps {
  searchParams: Promise<{
    search?: string;
    offset?: string;
    limit?: string;
  }>;
}

export default async function PermissionsPage({ searchParams }: PermissionsPageProps) {
  const params = await searchParams;
  const search = params.search;
  const offset = params.offset ? parseInt(params.offset) : 0;
  const limit = params.limit ? parseInt(params.limit) : 10;

  const filter: PermissionFilterDto = {
    search,
    pagination: {
      offset,
      limit,
    },
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Permisos</h1>
        <p className="text-muted-foreground">
          Consulta y gestiona los permisos disponibles en el sistema.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PermissionsFilters search={search} />

        <Suspense fallback={<PermissionsTableSkeleton />}>
          <PermissionsTableContent limit={limit} offset={offset} filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}

function PermissionsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="h-10 border-b px-4 py-2">
          <Skeleton className="h-6 w-[200px]" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 border-b px-4 py-3">
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
