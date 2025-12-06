'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { CustomerForm } from '../_components/customer-form';
import { customersService } from '@/lib/api/customers.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSchema } from '../_schemas/schemas';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const result = await customersService.create(data);
      toast.success('Cliente creado exitosamente');
      router.push('/operations/customers');
    } catch (error: any) {
      console.error('Error creating customer:', error);
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Error desconocido';
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
