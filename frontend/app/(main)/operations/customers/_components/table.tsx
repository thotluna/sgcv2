'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Customer } from '@/types/customer';
import { CustomerDropMenu } from './customerDropMenu';
import { statusMap } from '../_const/const';
import { Badge } from '@/components/ui/badge';

interface CustomersTableProps {
  data: Customer[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function CustomersTable({ data, isLoading, onDelete }: CustomersTableProps) {
  if (isLoading) {
    return <div className="w-full h-24 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Razón Social</TableHead>
            <TableHead>RIF/NIT</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          ) : (
            data.map(customer => (
              <TableRow key={customer.id}>
                <TableCell>{customer.code}</TableCell>
                <TableCell className="font-medium">{customer.legalName}</TableCell>
                <TableCell>{customer.taxId}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[customer.state].variant}>
                    {statusMap[customer.state].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CustomerDropMenu
                    id={customer.id}
                    customerName={customer.legalName}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
