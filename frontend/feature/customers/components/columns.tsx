import { CustomerDropMenu } from '@feature/customers/components/customerDropMenu';
import { statusMap } from '@feature/customers/constant';

import { CustomerDto } from '@sgcv2/shared';

import { TableColumn } from '@/components/table-generic';
import { Badge } from '@/components/ui';

export const columns: TableColumn<CustomerDto>[] = [
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
