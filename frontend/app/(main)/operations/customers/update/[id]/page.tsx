'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customersService } from '@/lib/api/customers.service';
import { CustomerForm } from '../../_components/customer-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSchema } from '../../_schemas/schemas';
import { Customer } from '@/types/customer';
import { toast } from 'sonner';

export default async function UpdateCustomerPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customersService.getOne(id);
        setCustomer(data);
      } catch (error) {
        console.error('Error fetching customer:', error);
        toast.error('Error al cargar el cliente');
        router.back();
      } finally {
        setIsFetching(false);
      }
    };

    fetchCustomer();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await customersService.update(id, data);
      toast.success('Cliente actualizado exitosamente');
      router.back();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Error al actualizar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Cargando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
