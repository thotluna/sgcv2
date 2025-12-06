'use client';

import { Customer } from '@/types/customer';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '../../../_components/customer-form';
import { updateSchema } from '../../../_schemas/schemas';
import { useState } from 'react';
import { customersService } from '@/lib/api/customers.service';
import { toast } from 'sonner';

export function UpdateCustomerForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await customersService.update(customer.id, data);
      toast.success('Cliente actualizado exitosamente');
      router.back();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Error al actualizar el cliente');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CustomerForm
      schema={updateSchema}
      defaultValues={{
        code: customer.code,
        businessName: customer.businessName || '',
        legalName: customer.legalName,
        taxId: customer.taxId,
        address: customer.address,
        phone: customer.phone || '',
        state: customer.state as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
      }}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isLoading={isLoading}
      isUpdate={true}
    />
  );
}
