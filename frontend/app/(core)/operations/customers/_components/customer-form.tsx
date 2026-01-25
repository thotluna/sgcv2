'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCustomerSchema, CreateCustomerSchemaType } from '@sgcv2/shared';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createCustomerAction, updateCustomerAction } from './actions';
import { toast } from 'sonner';
import { CustomerDto } from '@sgcv2/shared';

interface CustomerFormProps {
  customer?: CustomerDto;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const isUpdate = !!customer;

  const [state, formAction, isPending] = useActionState(
    isUpdate ? updateCustomerAction.bind(null, customer.id) : createCustomerAction,
    { success: false }
  );

  const form = useForm<CreateCustomerSchemaType>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      code: customer?.code || '',
      businessName: customer?.businessName || '',
      legalName: customer?.legalName || '',
      taxId: customer?.taxId || '',
      address: customer?.address || '',
      phone: customer?.phone || '',
    },
  });

  useEffect(() => {
    if (state.success) {
      toast.success(isUpdate ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
      router.push('/operations/customers');
      router.refresh();
    } else if (state.error) {
      toast.error(state.error.message || 'Error al procesar la solicitud');
    }
  }, [state, router, isUpdate]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="CUST01" {...field} disabled={isUpdate} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RIF</FormLabel>
                <FormControl>
                  <Input placeholder="J-12345678-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Legal</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre comercial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+58 412..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Procesando...' : isUpdate ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
