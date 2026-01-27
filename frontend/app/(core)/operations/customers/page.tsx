import { CustomersFilters } from './_components/filters';
import { CustomerState } from '@sgcv2/shared';
import { Suspense } from 'react';
import { CustomersTableContent } from './_components/table-content';
import { TableSkeleton } from '@/components/table/table-skeleton';

interface CustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const perPage = typeof params.perPage === 'string' ? parseInt(params.perPage) : 5;

  const filters = {
    search: typeof params.search === 'string' ? params.search : undefined,
    state: typeof params.status === 'string' ? (params.status as CustomerState) : undefined,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>

      <CustomersFilters search={filters.search} status={filters.state} />

      <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columnCount={5} />}>
        <CustomersTableContent page={page} perPage={perPage} filters={filters} />
      </Suspense>
    </div>
  );
}
