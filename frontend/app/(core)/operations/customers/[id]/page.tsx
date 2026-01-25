import { serverCustomersService } from '@/lib/api/server-customers.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Pencil,
  Building2,
  Hash,
  FileText,
  MapPin,
  Phone,
  Calendar,
} from 'lucide-react';
import { CustomerDto } from '@sgcv2/shared';
import { statusMap } from '../_const/const';
import { SubCustomersList } from '../_components/sub-customers-list';
import { LocationsList } from '../_components/locations-list';

export default async function CustomerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = await serverCustomersService.getOne(id);

  if (response.error) {
    notFound();
  }

  const customer: CustomerDto = response.data!;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/operations/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalles del Cliente</h1>
            <p className="text-muted-foreground">Información completa del cliente</p>
          </div>
        </div>
        <Link href={`/operations/customers/${id}/update`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="subcustomers">Sub-clientes</TabsTrigger>
          <TabsTrigger value="locations">Localidades</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{customer.legalName}</CardTitle>
                  <CardDescription className="mt-2">Código: {customer.code}</CardDescription>
                </div>
                <Badge variant={statusMap[customer.state].variant}>
                  {statusMap[customer.state].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Código</p>
                    <p className="text-base font-semibold">{customer.code}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Razón Social</p>
                    <p className="text-base font-semibold">{customer.legalName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">RIF/NIT</p>
                    <p className="text-base font-semibold">{customer.taxId}</p>
                  </div>
                </div>

                {customer.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                      <p className="text-base font-semibold">{customer.phone}</p>
                    </div>
                  </div>
                )}

                {customer.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                      <p className="text-base font-semibold">{customer.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Creado:{' '}
                      {new Date(customer.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Actualizado:{' '}
                      {new Date(customer.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcustomers" className="mt-6">
          <SubCustomersList customerId={id} />
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <LocationsList customerId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
