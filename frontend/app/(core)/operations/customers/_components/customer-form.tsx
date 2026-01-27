'use client';

import { useActionState } from 'react';

import { AlertCircle } from 'lucide-react';

import { CustomerDto } from '@sgcv2/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ActionState } from '../types';
import { createCustomerAction, updateCustomerAction } from './actions';

interface CustomerFormProps {
  customer?: CustomerDto;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const isUpdate = !!customer;

  const [state, formAction, isPending] = useActionState(
    isUpdate ? updateCustomerAction.bind(null, customer.id) : createCustomerAction,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            name="code"
            placeholder="CUST01"
            defaultValue={customer?.code || ''}
            disabled={isUpdate}
            aria-describedby={state.errors?.code ? 'code-error' : undefined}
          />
          {state.errors?.code && (
            <p id="code-error" className="text-sm font-medium text-destructive">
              {state.errors.code[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">RIF</Label>
          <Input
            id="taxId"
            name="taxId"
            placeholder="J-12345678-9"
            defaultValue={customer?.taxId || ''}
            aria-describedby={state.errors?.taxId ? 'taxId-error' : undefined}
          />
          {state.errors?.taxId && (
            <p id="taxId-error" className="text-sm font-medium text-destructive">
              {state.errors.taxId[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalName">Nombre Legal</Label>
          <Input
            id="legalName"
            name="legalName"
            placeholder="Nombre de la empresa"
            defaultValue={customer?.legalName || ''}
            aria-describedby={state.errors?.legalName ? 'legalName-error' : undefined}
          />
          {state.errors?.legalName && (
            <p id="legalName-error" className="text-sm font-medium text-destructive">
              {state.errors.legalName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Razón Social (Opcional)</Label>
          <Input
            id="businessName"
            name="businessName"
            placeholder="Nombre comercial"
            defaultValue={customer?.businessName || ''}
            aria-describedby={state.errors?.businessName ? 'businessName-error' : undefined}
          />
          {state.errors?.businessName && (
            <p id="businessName-error" className="text-sm font-medium text-destructive">
              {state.errors.businessName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+58 412..."
            defaultValue={customer?.phone || ''}
            aria-describedby={state.errors?.phone ? 'phone-error' : undefined}
          />
          {state.errors?.phone && (
            <p id="phone-error" className="text-sm font-medium text-destructive">
              {state.errors.phone[0]}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            name="address"
            placeholder="Dirección principal"
            defaultValue={customer?.address || ''}
            aria-describedby={state.errors?.address ? 'address-error' : undefined}
          />
          {state.errors?.address && (
            <p id="address-error" className="text-sm font-medium text-destructive">
              {state.errors.address[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Procesando...' : isUpdate ? 'Actualizar Cliente' : 'Crear Cliente'}
        </Button>
      </div>
    </form>
  );
}
