'use client';

import { CustomerDto } from '@sgcv2/shared';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '../../../_components/customer-form';
import { updateSchema } from '../../../_schemas/schemas';
import { useState } from 'react';
import { customersService } from '@/lib/api/customers.service';
import { toast } from 'sonner';
import { UpdateCustomerFormData, CustomerFormData } from '../../../types/types';

export function UpdateCustomerForm({ customer }: { customer: CustomerDto }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CustomerFormData) => {
    // We know it's update data because we passed updateSchema
    const updateData = data as UpdateCustomerFormData;
    setIsLoading(true);
    try {
      await customersService.update(customer.id, updateData);
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
