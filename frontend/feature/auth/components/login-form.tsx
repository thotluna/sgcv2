'use client';

import { useActionState } from 'react';

import { SubmitButton } from '@components/submit-button';
import { Input, Label } from '@components/ui';
import { loginAction } from '@feature/auth/actions';
import { ActionState } from '@lib/types';
import { AlertCircle } from 'lucide-react';

const initialState: ActionState = {
  success: false,
  message: '',
};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  return (
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
          autoComplete="new-password"
          className={state.errors?.password ? 'border-red-500' : ''}
        />
        {state.errors?.password && (
          <p className="text-sm text-red-500 font-medium">{state.errors.password[0]}</p>
        )}
      </div>

      <SubmitButton label="Iniciar sesión" loadingLabel="Iniciando sesión..." />
    </form>
  );
}
