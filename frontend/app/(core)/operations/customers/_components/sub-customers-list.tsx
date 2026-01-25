import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function SubCustomersList({ customerId }: { customerId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sub-clientes</CardTitle>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Sub-cliente
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">
            Gestión de sub-clientes para {customerId} estará disponible pronto.
          </p>
          <p className="text-xs text-muted-foreground">Fase 2: Implementación de Sub-clientes</p>
        </div>
      </CardContent>
    </Card>
  );
}
