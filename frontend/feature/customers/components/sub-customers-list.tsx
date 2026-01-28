import { MapPin, Plus, Trash2, Users } from 'lucide-react';

import { SubCustomerDto } from '@sgcv2/shared';

import { Column, DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { serverSubCustomersService } from '@/lib/api/server-subcustomers.service';

import { LocationForm } from './location-form';
import { SubCustomerForm } from './sub-customer-form';

interface SubCustomersListProps {
  customerId: string;
}

export async function SubCustomersList({ customerId }: SubCustomersListProps) {
  const response = await serverSubCustomersService.getAll(customerId);
  const subCustomers = response.success ? response.data || [] : [];

  const columns: Column<SubCustomerDto>[] = [
    {
      header: 'Código',
      accessor: sub => sub.externalCode,
    },
    {
      header: 'Nombre / Razón Social',
      accessor: sub => sub.businessName,
      className: 'font-medium',
    },
    {
      header: 'Fecha Registro',
      accessor: sub => (
        <span className="text-muted-foreground">
          {new Date(sub.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sub-clientes
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Clientes finales vinculados a este corporativo
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Sub-cliente
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle>Agregar Nuevo Sub-cliente</SheetTitle>
              <SheetDescription>
                Ingrese los datos para registrar un nuevo sub-cliente y su sede inicial.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <SubCustomerForm parentId={customerId} />
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <DataTable
          data={subCustomers}
          columns={columns}
          emptyMessage="Comience agregando el primer sub-cliente para este corporativo."
          rowActions={sub => (
            <div className="text-right flex justify-end gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Sede</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-[500px]">
                  <SheetHeader>
                    <SheetTitle>Nueva Sede para {sub.businessName}</SheetTitle>
                    <SheetDescription>
                      Agregue una nueva ubicación u oficina para este sub-cliente.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <LocationForm parentId={customerId} subCustomerId={sub.id} />
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
