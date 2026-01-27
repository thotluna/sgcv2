'use client';

import { useActionState } from 'react';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ActionState } from '../types';
import { createLocationAction } from './sub-customer-actions';

interface LocationFormProps {
  parentId: string;
  subCustomerId?: string | null;
  onCancel?: () => void;
}

export function LocationForm({ parentId, subCustomerId = null, onCancel }: LocationFormProps) {
  const [state, formAction, isPending] = useActionState(
    createLocationAction.bind(null, parentId, subCustomerId),
    { success: false } as ActionState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium flex items-center gap-2 border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          {state.message}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Sede</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ej: Sede Principal, Depósito Norte..."
          defaultValue=""
          aria-describedby={state.errors?.name ? 'name-error' : undefined}
        />
        {state.errors?.name && (
          <p id="name-error" className="text-sm font-medium text-destructive">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección Directa</Label>
        <Input
          id="address"
          name="address"
          placeholder="Calle, Av, Edificio..."
          defaultValue=""
          aria-describedby={state.errors?.address ? 'address-error' : undefined}
        />
        {state.errors?.address && (
          <p id="address-error" className="text-sm font-medium text-destructive">
            {state.errors.address[0]}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Sede'}
        </Button>
      </div>
    </form>
  );
}
