import { CustomerDto } from '@sgcv2/shared';

import { Column, DataTable } from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';

import { statusMap } from '../_const/const';
import { CustomerDropMenu } from './customerDropMenu';

interface CustomersTableProps {
  data: CustomerDto[];
}

export function CustomersTable({ data }: CustomersTableProps) {
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
      accessor: customer => customer.phone || 'N/A',
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
      emptyMessage="No se encontraron resultados."
      rowActions={customer => (
        <CustomerDropMenu id={customer.id} customerName={customer.legalName} />
      )}
    />
  );
}
