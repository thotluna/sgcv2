import { serverCustomersService } from '@/lib/api/server-customers.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Customer } from '@/types/customer';
import { statusMap } from '../_const/const';

export default async function CustomerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = await serverCustomersService.getOne(id);

  if (response.error) {
    notFound();
  }

  const customer: Customer = response.data;

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

      <div className="flex gap-3">
        <Link href="/operations/customers" className="flex-1">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>
        </Link>
        <Link href={`/operations/customers/${id}/update`} className="flex-1">
          <Button className="w-full">
            <Pencil className="mr-2 h-4 w-4" />
            Editar Cliente
          </Button>
        </Link>
      </div>
    </div>
  );
}
