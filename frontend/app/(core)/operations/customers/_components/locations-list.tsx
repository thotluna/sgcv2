import { Home, MapPin, Plus, Trash2 } from 'lucide-react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { serverLocationsService } from '@/lib/api/server-locations.service';

import { LocationForm } from './location-form';

interface LocationsListProps {
  customerId: string;
}

export async function LocationsList({ customerId }: LocationsListProps) {
  const response = await serverLocationsService.getAll(customerId);
  const locations = response.success ? response.data || [] : [];

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
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="font-semibold text-lg">No hay sedes</h3>
            <p className="text-muted-foreground max-w-[250px]">
              No se han registrado sedes o puntos de servicio aún.
            </p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Sede</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Asignación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map(loc => (
                  <TableRow key={loc.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {loc.subCustomerId ? (
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Home className="h-3 w-3 text-primary" />
                      )}
                      {loc.name}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{loc.address}</TableCell>
                    <TableCell>
                      {loc.subCustomerId ? (
                        <Badge variant="secondary">Sub-cliente</Badge>
                      ) : (
                        <Badge variant="outline">Principal</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
