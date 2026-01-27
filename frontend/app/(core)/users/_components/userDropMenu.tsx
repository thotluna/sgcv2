'use client';

import { useState } from 'react';
import Link from 'next/link';

import { EllipsisIcon, Eye, Trash } from 'lucide-react';

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

interface UserDropMenuProps {
  id: number;
  username: string;
  onDelete?: (id: number) => Promise<void>;
}

export function UserDropMenu({ id, username, onDelete }: UserDropMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const data = [
    {
      label: 'Ver / Editar',
      icon: Eye,
      href: `/users/${id}/edit`,
      shortCut: '⌘V',
    },
  ];

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
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

          {onDelete && (
            <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Bloquear
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Bloquear usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará al usuario <span className="font-semibold">{username}</span> como{' '}
              <span className="font-semibold text-red-600">BLOQUEADO</span>. El usuario ya no podrá
              iniciar sesión en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Bloqueando...' : 'Confirmar Bloqueo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
