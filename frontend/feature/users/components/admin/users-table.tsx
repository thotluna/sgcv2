import { UserDto } from '@sgcv2/shared';
import { UserDropMenu } from './userDropMenu';
import { Badge } from '@/components/ui';
import { DataTable, type Column } from '@/components/table/data-table';

interface UsersTableProps {
  data: UserDto[];
}

const statusMap = {
  ACTIVE: { label: 'Activo', variant: 'default' as const },
  INACTIVE: { label: 'Inactivo', variant: 'secondary' as const },
  BLOCKED: { label: 'Bloqueado', variant: 'destructive' as const },
};

export function UsersTable({ data = [] }: UsersTableProps) {
  const columns: Column<UserDto>[] = [
    {
      header: 'ID',
      accessor: user => user.id,
    },
    {
      header: 'Usuario',
      accessor: user => user.username,
      className: 'font-medium',
    },
    {
      header: 'Email',
      accessor: user => user.email,
    },
    {
      header: 'Estado',
      accessor: user => (
        <Badge variant={statusMap[user.status]?.variant ?? 'outline'}>
          {statusMap[user.status]?.label ?? user.status}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      emptyMessage="No se encontraron usuarios."
      rowActions={user => <UserDropMenu id={user.id} username={user.username} />}
    />
  );
}
