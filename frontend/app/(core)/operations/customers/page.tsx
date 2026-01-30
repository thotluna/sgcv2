import { Suspense } from 'react';

import { CustomersFilters } from '@feature/customers/components';
import { columns } from '@feature/customers/components/columns';
import { getAllCustomers } from '@feature/customers/services/customers.service';

import { CustomerState } from '@sgcv2/shared';

import { DataTable, TableSkeleton } from '@/components/table-generic';

interface CustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>

      <CustomersFilters
        search={typeof params.search === 'string' ? params.search : undefined}
        status={typeof params.status === 'string' ? (params.status as CustomerState) : undefined}
      />

      <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton columns={6} />}>
        <DataTable fetchData={getAllCustomers} headers={columns} searchParams={params} />
      </Suspense>
    </div>
  );
}
