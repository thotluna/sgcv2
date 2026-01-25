import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SubCustomersListProps {
  customerId: string;
}

export function SubCustomersList({ customerId: _customerId }: SubCustomersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sub-clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Gestión de sub-clientes planificada para la Fase 2 (Siguiente paso).
        </p>
      </CardContent>
    </Card>
  );
}
