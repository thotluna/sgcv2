'use client';

import { useRouter } from 'next/navigation';
import { CustomerForm } from '../_components/customer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCustomerAction } from '../_components/actions';

export default function NewCustomerPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm action={createCustomerAction} onCancel={() => router.back()} />
        </CardContent>
      </Card>
    </div>
  );
}
