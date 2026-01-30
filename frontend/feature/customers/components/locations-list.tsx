import { MapPin, Plus } from 'lucide-react';

import { DataTable } from '@/components/table-generic';
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
import { getAllLocations } from '@/feature/customers/services/locations.service';

import { LocationForm } from './location-form';
import { getLocationsColumns } from './locations-columns';

interface LocationsListProps {
  customerId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function LocationsList({ customerId, searchParams }: LocationsListProps) {
  const columns = getLocationsColumns();

  const fetchLocations = async (
    page: number,
    perPage: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: Record<string, string | number | boolean | undefined>
  ) => {
    return getAllLocations(customerId, {
      page,
      perPage,
      sortBy,
      sortOrder,
      ...filters,
    });
  };

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
          fetchData={fetchLocations}
          headers={columns}
          searchParams={searchParams}
          emptyMessage="No se han registrado sedes o puntos de servicio aún."
        />
      </CardContent>
    </Card>
  );
}
