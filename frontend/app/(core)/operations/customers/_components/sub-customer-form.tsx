'use client';

import { useActionState } from 'react';

import { AlertCircle, Building2, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { ActionState } from '../types';
import { createSubCustomerWithLocationAction } from './sub-customer-actions';

interface SubCustomerFormProps {
  parentId: string;
  onCancel?: () => void;
}

export function SubCustomerForm({ parentId, onCancel }: SubCustomerFormProps) {
  const [state, formAction, isPending] = useActionState(
    createSubCustomerWithLocationAction.bind(null, parentId),
    { success: false } as ActionState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium flex items-center gap-2 border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          {state.message}
        </div>
      )}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Building2 className="h-4 w-4" />
          Datos del Sub-cliente
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="externalCode">Código Externo (ID)</Label>
            <Input
              id="externalCode"
              name="externalCode"
              placeholder="Ej: 001, B-12..."
              defaultValue=""
              aria-describedby={state.errors?.externalCode ? 'externalCode-error' : undefined}
            />
            {state.errors?.externalCode && (
              <p id="externalCode-error" className="text-sm font-medium text-destructive">
                {state.errors.externalCode[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Nombre / Razón Social</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="Ej: Farmacia Central"
              defaultValue=""
              aria-describedby={state.errors?.businessName ? 'businessName-error' : undefined}
            />
            {state.errors?.businessName && (
              <p id="businessName-error" className="text-sm font-medium text-destructive">
                {state.errors.businessName[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <MapPin className="h-4 w-4" />
          Sede Inicial Obligatoria
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="locationName">Nombre de la Sede</Label>
            <Input
              id="locationName"
              name="locationName"
              placeholder="Ej: Sede Principal"
              defaultValue="Sede Principal"
              aria-describedby={state.errors?.locationName ? 'locationName-error' : undefined}
            />
            {state.errors?.locationName && (
              <p id="locationName-error" className="text-sm font-medium text-destructive">
                {state.errors.locationName[0]}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="locationAddress">Dirección Directa</Label>
            <Input
              id="locationAddress"
              name="locationAddress"
              placeholder="Calle, Av, Edificio..."
              defaultValue=""
              aria-describedby={state.errors?.locationAddress ? 'locationAddress-error' : undefined}
            />
            {state.errors?.locationAddress && (
              <p id="locationAddress-error" className="text-sm font-medium text-destructive">
                {state.errors.locationAddress[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" className="min-w-[120px]" disabled={isPending}>
          {isPending ? 'Creando...' : 'Crear Sub-cliente'}
        </Button>
      </div>
    </form>
  );
}
