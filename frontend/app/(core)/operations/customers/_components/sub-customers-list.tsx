import { serverSubCustomersService } from '@/lib/api/server-subcustomers.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Trash2, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SubCustomerForm } from './sub-customer-form';
import { LocationForm } from './location-form';

interface SubCustomersListProps {
  customerId: string;
}

export async function SubCustomersList({ customerId }: SubCustomersListProps) {
  const response = await serverSubCustomersService.getAll(customerId);
  const subCustomers = response.success ? response.data || [] : [];

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
        {subCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="font-semibold text-lg">No hay sub-clientes</h3>
            <p className="text-muted-foreground max-w-[250px]">
              Comience agregando el primer sub-cliente para este corporativo.
            </p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre / Razón Social</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCustomers.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.externalCode}</TableCell>
                    <TableCell>{sub.businessName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
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
