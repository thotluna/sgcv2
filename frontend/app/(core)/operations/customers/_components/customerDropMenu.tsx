'use client';

import { useState } from 'react';
import Link from 'next/link';

import { EllipsisIcon, Eye, Pencil, Trash } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CustomerDropMenuProps {
  id: string;
  customerName: string;
  onDelete: (id: string) => Promise<void>;
}

export function CustomerDropMenu({ id, customerName, onDelete }: CustomerDropMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const data = [
    {
      label: 'Ver',
      icon: Eye,
      href: `/operations/customers/${id}`,
      shortCut: '⌘V',
    },
    {
      label: 'Editar',
      icon: Pencil,
      href: `/operations/customers/${id}/update`,
      shortCut: '⌘E',
    },
  ];

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ml-2">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {data.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                <DropdownMenuShortcut>{item.shortCut}</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente{' '}
              <span className="font-semibold">{customerName}</span> de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
