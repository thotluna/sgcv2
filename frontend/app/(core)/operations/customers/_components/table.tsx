'use client';

import { CustomerDto } from '@sgcv2/shared';
import { CustomerDropMenu } from './customerDropMenu';
import { statusMap } from '../_const/const';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/table/data-table';

interface CustomersTableProps {
  data: CustomerDto[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function CustomersTable({ data, isLoading, onDelete }: CustomersTableProps) {
  const columns: Column<CustomerDto>[] = [
    {
      header: 'Código',
      accessor: customer => customer.code,
    },
    {
      header: 'Razón Social',
      accessor: customer => customer.legalName,
      className: 'font-medium',
    },
    {
      header: 'RIF/NIT',
      accessor: customer => customer.taxId,
    },
    {
      header: 'Teléfono',
      accessor: customer => customer.phone,
    },
    {
      header: 'Estado',
      accessor: customer => (
        <Badge variant={statusMap[customer.state].variant}>{statusMap[customer.state].label}</Badge>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No se encontraron resultados."
      rowActions={customer => (
        <CustomerDropMenu id={customer.id} customerName={customer.legalName} onDelete={onDelete} />
      )}
    />
  );
}
