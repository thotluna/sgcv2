import { Suspense } from 'react';

import { LocationsFilters } from '@feature/customers/components/locations.filters';
import { getLocationsColumns } from '@feature/customers/components/locations-columns';
import { getAllLocations } from '@feature/customers/services/locations.service';

import { DataTable, TableSkeleton } from '@/components/table-generic';

interface LocationsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const fetchDataAdapter = async (
  page: number,
  perPage: number,
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc' | undefined,
  filters: Record<string, string | number | boolean | undefined> = {}
) => {
  return getAllLocations(undefined, {
    page,
    perPage,
    sortBy,
    sortOrder,
    search: typeof filters.search === 'string' ? filters.search : undefined,
  });
};

export default async function LocationsPage({ searchParams }: LocationsPageProps) {
  const params = await searchParams;
  const columns = getLocationsColumns();

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Sedes</h1>
        <p className="text-muted-foreground">Listado global de todas las sedes del sistema.</p>
      </div>

      <LocationsFilters search={typeof params.search === 'string' ? params.search : undefined} />

      <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columns={columns.length} />}>
        <DataTable fetchData={fetchDataAdapter} headers={columns} searchParams={params} />
      </Suspense>
    </div>
  );
}
