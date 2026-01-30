import { Suspense } from 'react';

import { CustomersFilters } from '@feature/customers/components';
import { CustomerDropMenu } from '@feature/customers/components/customerDropMenu';
import { statusMap } from '@feature/customers/constant';
import { getAllCustomers } from '@feature/customers/services/customers.service';

import { CustomerDto, CustomerState } from '@sgcv2/shared';

import { DataTable, TableColumn, TableSkeleton } from '@/components/table-generic';
import { Badge } from '@/components/ui';

interface CustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const headers: TableColumn<CustomerDto>[] = [
  {
    id: 'code',
    label: 'Código',
    isOrderable: true,
  },
  {
    id: 'legalName',
    label: 'Razón Social',
    isOrderable: true,
    cell: item => <span className="font-medium">{item.legalName}</span>,
  },
  {
    id: 'taxId',
    label: 'RIF/NIT',
    isOrderable: true,
  },
  {
    id: 'phone',
    label: 'Teléfono',
    isOrderable: false,
    cell: item => item.phone || 'N/A',
  },
  {
    id: 'state',
    label: 'Estado',
    isOrderable: true,
    cell: item => (
      <Badge variant={statusMap[item.state].variant}>{statusMap[item.state].label}</Badge>
    ),
  },
  {
    id: 'actions',
    label: 'Acciones',
    isOrderable: false,
    cell: item => <CustomerDropMenu id={item.id} customerName={item.legalName} />,
  },
];

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
        <DataTable fetchData={getAllCustomers} headers={headers} searchParams={params} />
      </Suspense>
    </div>
  );
}
