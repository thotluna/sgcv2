import { RoleDto } from '@sgcv2/shared';

import { Column, DataTable } from '@/components/table/data-table';

import { RoleDropMenu } from './roleDropMenu';

interface RolesTableProps {
  data: RoleDto[];
}

export function RolesTable({ data }: RolesTableProps) {
  const columns: Column<RoleDto>[] = [
    {
      header: 'ID',
      accessor: role => role.id,
      className: 'w-[80px]',
    },
    {
      header: 'Nombre',
      accessor: role => <span className="font-medium">{role.name}</span>,
    },
    {
      header: 'Descripción',
      accessor: role => role.description || '-',
    },
  ];

  return (
    <DataTable data={data} columns={columns} rowActions={role => <RoleDropMenu role={role} />} />
  );
}
