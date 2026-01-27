import Link from 'next/link';

import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomerNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Cliente No Encontrado</CardTitle>
            <CardDescription className="mt-2">
              El cliente que buscas no existe o ha sido eliminado.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>Posibles razones:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>El cliente fue eliminado recientemente</li>
              <li>El ID del cliente es incorrecto</li>
              <li>No tienes permisos para ver este cliente</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/operations/customers" className="w-full">
              <Button className="w-full" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la Lista de Clientes
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Ir al Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
