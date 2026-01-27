'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { deleteRoleAction } from '@feature/roles/actions';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { RoleDto } from '@sgcv2/shared';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RoleDropMenuProps {
  role: RoleDto;
}

export function RoleDropMenu({ role }: RoleDropMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este rol?')) return;

    startTransition(async () => {
      const result = await deleteRoleAction(id);
      if (result.success) {
        toast.success(result.message || 'Rol eliminado con éxito');
      } else {
        toast.error(result.message || 'Error al eliminar el rol');
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/roles/${role.id}`)}>
          <SquarePen className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(role.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
