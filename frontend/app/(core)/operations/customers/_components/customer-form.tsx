'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { CustomerState } from '@sgcv2/shared';
import { ActionState } from './actions';

interface CustomerFormProps {
  action: (state: ActionState, payload: FormData) => Promise<ActionState>;
  defaultValues?: Partial<{
    code: string;
    legalName: string;
    businessName: string;
    taxId: string;
    address: string;
    phone: string;
    state: CustomerState;
  }>;
  onCancel: () => void;
  isUpdate?: boolean;
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export function CustomerForm({
  action,
  defaultValues,
  onCancel,
  isUpdate = false,
}: CustomerFormProps) {
  const [state, dispatch, isPending] = useActionState(action, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      {state.message && !state.success && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{state.message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            name="code"
            placeholder="ABC12"
            maxLength={5}
            defaultValue={defaultValues?.code}
            disabled={isUpdate || isPending}
          />
          {state.fieldErrors?.code && (
            <p className="text-sm text-red-500">{state.fieldErrors.code[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalName">Nombre Legal</Label>
          <Input
            id="legalName"
            name="legalName"
            placeholder="Empresa S.A."
            defaultValue={defaultValues?.legalName}
            disabled={isPending}
          />
          {state.fieldErrors?.legalName && (
            <p className="text-sm text-red-500">{state.fieldErrors.legalName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Razón Social (Opcional)</Label>
          <Input
            id="businessName"
            name="businessName"
            placeholder="Nombre comercial"
            defaultValue={defaultValues?.businessName}
            disabled={isPending}
          />
          {state.fieldErrors?.businessName && (
            <p className="text-sm text-red-500">{state.fieldErrors.businessName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">RIF / NIT</Label>
          <Input
            id="taxId"
            name="taxId"
            placeholder="J-12345678-9"
            defaultValue={defaultValues?.taxId}
            disabled={isPending}
          />
          {state.fieldErrors?.taxId && (
            <p className="text-sm text-red-500">{state.fieldErrors.taxId[0]}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            name="address"
            placeholder="Calle Principal, Edificio..."
            defaultValue={defaultValues?.address}
            disabled={isPending}
          />
          {state.fieldErrors?.address && (
            <p className="text-sm text-red-500">{state.fieldErrors.address[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono (Opcional)</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+58 412 1234567"
            defaultValue={defaultValues?.phone}
            disabled={isPending}
          />
          {state.fieldErrors?.phone && (
            <p className="text-sm text-red-500">{state.fieldErrors.phone[0]}</p>
          )}
        </div>

        {isUpdate && (
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <select
              id="state"
              name="state"
              defaultValue={defaultValues?.state}
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={CustomerState.ACTIVE}>Activo</option>
              <option value={CustomerState.INACTIVE}>Inactivo</option>
              <option value={CustomerState.SUSPENDED}>Suspendido</option>
            </select>
            {state?.fieldErrors?.state && (
              <p className="text-sm text-red-500">{state.fieldErrors.state[0]}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cliente
        </Button>
      </div>
    </form>
  );
}
