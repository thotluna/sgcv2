import {
  type TableColumn,
  TableHeader as CustomTableHeader,
  TablePagination,
} from '@components/table-generic';

import type { AppResponse } from '@sgcv2/shared';

import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<T> {
  fetchData: (
    page: number,
    perPage: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: { state?: string; search?: string }
  ) => Promise<AppResponse<T[]>>;

  headers: TableColumn<T>[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function DataTable<T>({ fetchData, headers, searchParams }: DataTableProps<T>) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy as string | undefined;
  const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') || 'asc';
  const filters = searchParams.filters as { state?: string; search?: string } | undefined;

  const response = await fetchData(page, pageSize, sortBy, sortOrder, filters);

  if (!response.success || !response.data) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          {response.error?.message || 'Error al cargar los datos'}
        </p>
      </div>
    );
  }

  const { data, metadata } = response;

  const total = metadata?.pagination?.total || 0;
  const perPage = metadata?.pagination?.perPage || 5;

  if (!data.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(header => (
                <CustomTableHeader
                  key={header.id}
                  header={{
                    id: header.id,
                    label: header.label,
                    isOrderable: header.isOrderable,
                  }}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((items, id) => {
              return (
                <TableRow key={id}>
                  {headers.map(header => (
                    <TableCell key={header.id}>
                      {header.cell
                        ? header.cell(items)
                        : (items[header.id as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {metadata && <TablePagination currentPage={page} totalPages={totalPages} />}
    </div>
  );
}
