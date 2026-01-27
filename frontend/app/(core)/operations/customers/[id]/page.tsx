import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { Info, MapPin, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { serverCustomersService } from '@/lib/api/server-customers.service';

import { CustomerDetailsHeader } from '../_components/customer-details-header';
import { LocationsList } from '../_components/locations-list';
import { SubCustomersList } from '../_components/sub-customers-list';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const response = await serverCustomersService.getOne(id);

  if (response.error || !response.data) {
    notFound();
  }

  const customer = response.data;

  return (
    <div className="flex flex-col gap-6 p-6">
      <CustomerDetailsHeader customer={customer} />

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Información
          </TabsTrigger>
          <TabsTrigger value="subcustomers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sub-clientes
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Sedes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datos Generales</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Razón Social</span>
                  <span>{customer.legalName}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Nombre Comercial
                  </span>
                  <span>{customer.businessName || 'N/A'}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-muted-foreground">RIF / Cédula</span>
                  <span>{customer.taxId}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacto y Dirección</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Teléfono</span>
                  <span>{customer.phone || 'N/A'}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Dirección Fiscal
                  </span>
                  <span className="whitespace-pre-wrap">{customer.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subcustomers" className="mt-6">
          <Suspense fallback={<div>Cargando sub-clientes...</div>}>
            <SubCustomersList customerId={id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <Suspense fallback={<div>Cargando sedes...</div>}>
            <LocationsList customerId={id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
