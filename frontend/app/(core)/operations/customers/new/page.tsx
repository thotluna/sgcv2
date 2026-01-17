'use client';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { CustomerForm } from '../_components/customer-form';
import { customersService } from '@/lib/api/customers.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSchema } from '../_schemas/schemas';
import { CreateCustomerFormData, CustomerFormData } from '../types/types';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CustomerFormData) => {
    const createData = data as CreateCustomerFormData;
    setIsLoading(true);

    try {
      await customersService.create(createData);
      toast.success('Cliente creado exitosamente');
      router.push('/operations/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      let errorMessage = 'Error desconocido';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(`Error al crear el cliente: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm
            schema={createSchema}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
