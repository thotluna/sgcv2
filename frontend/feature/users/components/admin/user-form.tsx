'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

import { createUserAction, updateUserAction } from '@feature/users/actions';
import { ActionState } from '@lib/types';

import { SubmitButton } from '@/components/submit-button';
import { Button, Input, Label } from '@/components/ui';

interface UserFormValues {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}

interface UserFormProps {
  userId?: number;
  initialData?: UserFormValues;
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export function UserForm({ userId, initialData }: UserFormProps) {
  const router = useRouter();
  const isEditMode = !!userId;

  // Bind the action with userId if in edit mode
  const action = isEditMode ? updateUserAction.bind(null, userId) : createUserAction;

  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>

        <form action={formAction} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={initialData?.username}
              placeholder="jdoe"
              disabled={isEditMode}
            />
            {state?.errors?.username && (
              <p className="text-destructive text-xs font-medium">{state.errors.username[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialData?.email}
              placeholder="john@example.com"
            />
            {state?.errors?.email && (
              <p className="text-destructive text-xs font-medium">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Contraseña {isEditMode && '(Dejar en blanco para mantener actual)'}
            </Label>
            <Input id="password" name="password" type="password" />
            {state?.errors?.password && (
              <p className="text-destructive text-xs font-medium">{state.errors.password[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              name="status"
              defaultValue={initialData?.status || 'ACTIVE'}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="BLOCKED">Bloqueado</option>
            </select>
            {state?.errors?.status && (
              <p className="text-destructive text-xs font-medium">{state.errors.status[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={initialData?.firstName}
              placeholder="John"
            />
            {state?.errors?.firstName && (
              <p className="text-destructive text-xs font-medium">{state.errors.firstName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={initialData?.lastName}
              placeholder="Doe"
            />
            {state?.errors?.lastName && (
              <p className="text-destructive text-xs font-medium">{state.errors.lastName[0]}</p>
            )}
          </div>

          {!state.success && state.message && !state.errors && (
            <div className="col-span-full bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
              {state.message}
            </div>
          )}

          <div className="col-span-full pt-4 border-t flex flex-row-reverse justify-start gap-3">
            <SubmitButton
              label="Guardar Cambios"
              loadingLabel={isEditMode ? 'Actualizando...' : 'Creando...'}
            />
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
