import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { serverCustomersService } from '../_components/actions';
import { CustomerDetailsHeader } from '../_components/customer-details-header';
import { CustomerDetailsTabs } from '../_components/customer-details-tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, MapPin, Users } from 'lucide-react';
import { LocationsList } from '../_components/locations-list';
import { SubCustomersList } from '../_components/sub-customers-list';

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const response = await serverCustomersService.getOne(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const customer = response.data;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CustomerDetailsHeader customer={customer} />

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Información General
          </TabsTrigger>
          <TabsTrigger value="subcustomers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sub-clientes
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Localidades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos Básicos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Razón Social</p>
                <p>{customer.businessName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre Legal</p>
                <p>{customer.legalName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">RIF</p>
                <p>{customer.taxId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Código</p>
                <p>{customer.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p>{customer.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <p>{customer.state}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                <p>{customer.address}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcustomers">
          <Suspense fallback={<div>Cargando sub-clientes...</div>}>
            <SubCustomersList customerId={id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="locations">
          <Suspense fallback={<div>Cargando localidades...</div>}>
            <LocationsList customerId={id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
