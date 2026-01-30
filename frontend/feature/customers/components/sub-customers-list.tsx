import { Plus, Users } from 'lucide-react';

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
import { getAllSubCustomers } from '@/feature/customers/services/sub-customers.service';

import { SubCustomerForm } from './sub-customer-form';
import { getSubCustomersColumns } from './sub-customers-columns';

interface SubCustomersListProps {
  customerId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function SubCustomersList({ customerId, searchParams }: SubCustomersListProps) {
  const columns = getSubCustomersColumns({ customerId });

  const fetchSubCustomers = async (
    page: number,
    perPage: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: Record<string, string | number | boolean | undefined>
  ) => {
    return getAllSubCustomers(customerId, {
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
          fetchData={fetchSubCustomers}
          headers={columns}
          searchParams={searchParams}
          emptyMessage="Comience agregando el primer sub-cliente para este corporativo."
        />
      </CardContent>
    </Card>
  );
}
