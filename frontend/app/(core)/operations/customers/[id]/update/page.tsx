import { serverCustomersService } from '@/lib/api/server-customers.service';
import { UpdateCustomerForm } from './_components/update-customer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function UpdateCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = await serverCustomersService.getOne(id);

  if (response.error || !response.data) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateCustomerForm customer={response.data} />
        </CardContent>
      </Card>
    </div>
  );
}
