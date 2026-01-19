'use client';

import { RoleDto } from '@sgcv2/shared';
import { Column, DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const rowActions = (_role: RoleDto) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          <SquarePen className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => {}}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return <DataTable data={data} columns={columns} rowActions={rowActions} />;
}
