'use client';

import { UserDto } from '@sgcv2/shared';
import { UserDropMenu } from './userDropMenu';
import { Badge } from '@/components/ui';
import { DataTable, type Column } from '@/components/table/data-table';
import { blockUserAction } from '@feature/users/actions';
import { toast } from 'sonner';

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
  const handleDelete = async (id: number) => {
    const result = await blockUserAction(id);
    if (result.success) {
      toast.success('Usuario bloqueado correctamente');
    } else {
      toast.error(result.error?.message || 'Error al bloquear el usuario');
    }
  };

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
      isLoading={isLoading}
      emptyMessage="No se encontraron usuarios."
      rowActions={user => (
        <UserDropMenu id={user.id} username={user.username} onDelete={handleDelete} />
      )}
    />
  );
}
