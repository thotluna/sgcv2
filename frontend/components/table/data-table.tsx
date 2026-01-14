'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowActions?: (item: T) => ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No results found.',
  rowActions,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-24 flex items-center justify-center text-muted-foreground animate-pulse">
        Loading...
      </div>
    );
  }

  const hasActions = !!rowActions;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {hasActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center h-24 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.className}>
                    {column.accessor(item)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className="text-right">
                    {rowActions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
