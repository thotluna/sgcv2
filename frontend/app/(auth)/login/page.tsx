'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { loginAction } from './actions';
import { ActionState } from '@/lib/types';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Iniciando sesión...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Ingresar
        </>
      )}
    </Button>
  );
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sistema de Gestión y Control
          </CardTitle>
          <CardDescription className="text-center">
            Introduce tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {!state.success && state.message && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium flex items-center gap-2 border border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                {state.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="usuario"
                className={state.errors?.username ? 'border-red-500 chain-error' : ''}
              />
              {state.errors?.username && (
                <p className="text-sm text-red-500 font-medium">{state.errors.username[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={state.errors?.password ? 'border-red-500' : ''}
              />
              {state.errors?.password && (
                <p className="text-sm text-red-500 font-medium">{state.errors.password[0]}</p>
              )}
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
