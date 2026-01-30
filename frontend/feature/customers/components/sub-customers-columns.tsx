import { MapPin, Trash2 } from 'lucide-react';

import { SubCustomerDto } from '@sgcv2/shared';

import { TableColumn } from '@/components/table-generic';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { LocationForm } from './location-form';

interface GetSubCustomersColumnsProps {
  customerId: string;
}

export const getSubCustomersColumns = ({
  customerId,
}: GetSubCustomersColumnsProps): TableColumn<SubCustomerDto>[] => [
  {
    id: 'externalCode',
    label: 'Código',
    isOrderable: true,
  },
  {
    id: 'businessName',
    label: 'Nombre / Razón Social',
    isOrderable: true,
    cell: item => <span className="font-medium">{item.businessName}</span>,
  },
  {
    id: 'createdAt',
    label: 'Fecha Registro',
    isOrderable: true,
    cell: item => (
      <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    id: 'actions',
    label: 'Acciones',
    isOrderable: false,
    cell: item => (
      <div className="text-right flex justify-end gap-2 px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Sede</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle>Nueva Sede para {item.businessName}</SheetTitle>
              <SheetDescription>
                Agregue una nueva ubicación u oficina para este sub-cliente.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <LocationForm parentId={customerId} subCustomerId={item.id} />
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
