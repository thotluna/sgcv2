import { Home, MapPin, Plus, Trash2 } from 'lucide-react';

import { CustomerLocationDto } from '@sgcv2/shared';

import { Column, DataTable } from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';
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
import { serverLocationsService } from '@/lib/api/server-locations.service';

import { LocationForm } from './location-form';

interface LocationsListProps {
  customerId: string;
}

export async function LocationsList({ customerId }: LocationsListProps) {
  const response = await serverLocationsService.getAll(customerId);
  const locations = response.success ? response.data || [] : [];

  const columns: Column<CustomerLocationDto>[] = [
    {
      header: 'Nombre Sede',
      accessor: loc => (
        <div className="flex items-center gap-2">
          {loc.subCustomerId ? (
            <MapPin className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Home className="h-3 w-3 text-primary" />
          )}
          {loc.name}
        </div>
      ),
      className: 'font-medium',
    },
    {
      header: 'Dirección',
      accessor: loc => <div className="max-w-[300px] truncate">{loc.address}</div>,
    },
    {
      header: 'Asignación',
      accessor: loc =>
        loc.subCustomerId ? (
          <Badge variant="secondary">Sub-cliente</Badge>
        ) : (
          <Badge variant="outline">Principal</Badge>
        ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Sedes / Localidades
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Puntos de servicio registrados para este cliente
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Sede Central
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle>Agregar Nueva Sede</SheetTitle>
              <SheetDescription>
                Esta sede estará vinculada directamente al cliente principal.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <LocationForm parentId={customerId} />
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <DataTable
          data={locations}
          columns={columns}
          emptyMessage="No se han registrado sedes o puntos de servicio aún."
          rowActions={() => (
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        />
      </CardContent>
    </Card>
  );
}
