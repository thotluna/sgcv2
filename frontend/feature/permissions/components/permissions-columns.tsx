import { PermissionDto } from '@sgcv2/shared';

import { TableColumn } from '@/components/table-generic';

export const columns: TableColumn<PermissionDto>[] = [
  {
    id: 'resource',
    label: 'Recurso',
    isOrderable: true,
    cell: item => <span className="font-medium capitalize">{item.resource}</span>,
  },
  {
    id: 'action',
    label: 'Acción',
    isOrderable: true,
    cell: item => (
      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 capitalize">
        {item.action}
      </span>
    ),
  },
  {
    id: 'description',
    label: 'Descripción',
    isOrderable: true,
    cell: item => (
      <span className="text-muted-foreground">
        {item.description || 'Sin descripción disponible.'}
      </span>
    ),
  },
];
