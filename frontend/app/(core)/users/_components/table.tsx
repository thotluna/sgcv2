'use client';

import { UserDto } from '@sgcv2/shared';
import { UserDropMenu } from './userDropMenu';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/table/data-table';

interface UsersTableProps {
  data: UserDto[];
  isLoading?: boolean;
}

const statusMap = {
  ACTIVE: { label: 'Activo', variant: 'default' as const },
  INACTIVE: { label: 'Inactivo', variant: 'secondary' as const },
  BLOCKED: { label: 'Bloqueado', variant: 'destructive' as const },
};

export function UsersTable({ data = [], isLoading }: UsersTableProps) {
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
        <Badge variant={statusMap[user.isActive]?.variant ?? 'outline'}>
          {statusMap[user.isActive]?.label ?? user.isActive}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No se encontraron usuarios."
      rowActions={user => (
        <UserDropMenu
          id={user.id}
          username={user.username}
          // onDelete for users might be implemented later or handled via parent
        />
      )}
    />
  );
}
