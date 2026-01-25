import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationsListProps {
  customerId: string;
}

export function LocationsList({ customerId }: LocationsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Localidades</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Gestión de localidades planificada para la Fase 3.
        </p>
      </CardContent>
    </Card>
  );
}
