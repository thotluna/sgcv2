import { RoleDto } from '@sgcv2/shared';

import { TableColumn } from '@/components/table-generic';

import { RoleDropMenu } from './roleDropMenu';

export const columns: TableColumn<RoleDto>[] = [
  {
    id: 'id',
    label: 'ID',
    isOrderable: true,
  },
  {
    id: 'name',
    label: 'Nombre',
    isOrderable: true,
  },
  {
    id: 'description',
    label: 'Descripción',
    isOrderable: true,
  },
  {
    id: 'actions',
    label: 'Acciones',
    isOrderable: false,
    cell: item => <RoleDropMenu role={item} />,
  },
];
