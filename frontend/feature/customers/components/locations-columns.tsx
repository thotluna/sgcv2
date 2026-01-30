import { Home, MapPin, Trash2 } from 'lucide-react';

import { CustomerLocationDto } from '@sgcv2/shared';

import { TableColumn } from '@/components/table-generic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const getLocationsColumns = (): TableColumn<CustomerLocationDto>[] => [
  {
    id: 'name',
    label: 'Nombre Sede',
    isOrderable: true,
    cell: item => (
      <div className="flex items-center gap-2 font-medium">
        {item.subCustomerId ? (
          <MapPin className="h-3 w-3 text-muted-foreground" />
        ) : (
          <Home className="h-3 w-3 text-primary" />
        )}
        {item.name}
      </div>
    ),
  },
  {
    id: 'address',
    label: 'Dirección',
    isOrderable: true,
    cell: item => <div className="max-w-[300px] truncate">{item.address}</div>,
  },
  {
    id: 'assignment',
    label: 'Asignación',
    isOrderable: false,
    cell: item =>
      item.subCustomerId ? (
        <Badge variant="secondary">Sub-cliente</Badge>
      ) : (
        <Badge variant="outline">Principal</Badge>
      ),
  },
  {
    id: 'actions',
    label: 'Acciones',
    isOrderable: false,
    cell: () => (
      <div className="text-right flex justify-end px-4">
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
