'use client';

import { useActionState, useEffect } from 'react';
import { updatePasswordAction } from '@feature/users/profile.actions';
import {
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { toast } from 'sonner';
import { ActionState } from '@lib/types';
import { SubmitButton } from '@/components/submit-button';

const initialState: ActionState = {
  success: false,
  message: '',
};

export function PasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Contraseña actualizada con éxito');
    } else if (state.message && state.success === false && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar Contraseña</CardTitle>
        <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input id="currentPassword" name="currentPassword" type="password" />
            {state?.errors?.currentPassword && (
              <p className="text-destructive text-sm font-medium">
                {state.errors.currentPassword[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nueva Contraseña</Label>
            <Input id="password" name="password" type="password" />
            {state?.errors?.password && (
              <p className="text-destructive text-sm font-medium">{state.errors.password[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" />
            {state?.errors?.confirmPassword && (
              <p className="text-destructive text-sm font-medium">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton label="Actualizar Contraseña" loadingLabel="Actualizando..." />
        </CardFooter>
      </form>
    </Card>
  );
}
