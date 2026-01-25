import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function LocationsList({ customerId }: { customerId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Localidades</CardTitle>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Localidad
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">
            Gestión de localidades para {customerId} estará disponible pronto.
          </p>
          <p className="text-xs text-muted-foreground">Fase 3: Implementación de Localidades</p>
        </div>
      </CardContent>
    </Card>
  );
}
