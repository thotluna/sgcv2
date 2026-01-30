import { UserDto } from '@sgcv2/shared';

import { TableColumn } from '@/components/table-generic';
import { Badge } from '@/components/ui';

import { UserDropMenu } from './userDropMenu';

const statusMap = {
  ACTIVE: { label: 'Activo', variant: 'default' as const },
  INACTIVE: { label: 'Inactivo', variant: 'secondary' as const },
  BLOCKED: { label: 'Bloqueado', variant: 'destructive' as const },
};

export const columns: TableColumn<UserDto>[] = [
  {
    id: 'id',
    label: 'ID',
    isOrderable: true,
  },
  {
    id: 'username',
    label: 'Usuario',
    isOrderable: true,
  },
  {
    id: 'email',
    label: 'Email',
    isOrderable: true,
  },
  {
    id: 'status',
    label: 'Estado',
    isOrderable: true,
    cell: (user: UserDto) => (
      <Badge variant={statusMap[user.status]?.variant ?? 'outline'}>
        {statusMap[user.status]?.label ?? user.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    label: 'Acciones',
    isOrderable: false,
    cell: (user: UserDto) => <UserDropMenu id={user.id} username={user.username} />,
  },
];
