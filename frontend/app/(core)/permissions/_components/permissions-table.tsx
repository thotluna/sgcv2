import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface Permission {
  id: number;
  resource: string;
  action: string;
  description?: string;
}

interface PermissionsTableProps {
  data: Permission[];
}

export function PermissionsTable({ data }: PermissionsTableProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          No se encontraron permisos.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Recurso</TableHead>
            <TableHead className="w-[150px]">Acción</TableHead>
            <TableHead>Descripción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(permission => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium capitalize">{permission.resource}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 capitalize">
                  {permission.action}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {permission.description || 'Sin descripción disponible.'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
