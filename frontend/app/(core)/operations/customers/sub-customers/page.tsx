import { Suspense } from 'react';

import { SubCustomersFilters } from '@feature/customers/components/sub-customers.filters';
import { getSubCustomersColumns } from '@feature/customers/components/sub-customers-columns';
import { getAllSubCustomers } from '@feature/customers/services/sub-customers.service';

import { DataTable, TableSkeleton } from '@/components/table-generic';

interface SubCustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const fetchDataAdapter = async (
  page: number,
  perPage: number,
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc' | undefined,
  filters: Record<string, string | number | boolean | undefined> = {}
) => {
  const customerId = filters.customerId as string;
  return getAllSubCustomers(customerId, {
    page,
    perPage,
    sortBy,
    sortOrder,
    search: typeof filters.search === 'string' ? filters.search : undefined,
  });
};

export default async function SubCustomersPage({ searchParams }: SubCustomersPageProps) {
  const params = await searchParams;
  const customerId = typeof params.customerId === 'string' ? params.customerId : '';
  const columns = getSubCustomersColumns({ customerId });

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Sub Clientes</h1>
      </div>

      <SubCustomersFilters
        search={typeof params.search === 'string' ? params.search : undefined}
        customerId={typeof params.customerId === 'string' ? params.customerId : undefined}
      />

      <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columns={6} />}>
        <DataTable fetchData={fetchDataAdapter} headers={columns} searchParams={params} />
      </Suspense>
    </div>
  );
}
