'use client';

import { useActionState, useEffect } from 'react';

import { updateEmailAction } from '@feature/users/profile.actions';
import { ActionState } from '@lib/types';
import { toast } from 'sonner';

import { SubmitButton } from '@/components/submit-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';

interface EmailFormProps {
  initialEmail?: string;
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export function EmailForm({ initialEmail }: EmailFormProps) {
  const [state, formAction] = useActionState(updateEmailAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Correo actualizado con éxito');
    } else if (state.message && state.success === false && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correo Electrónico</CardTitle>
        <CardDescription>
          Cambia la dirección de correo electrónico asociada a tu cuenta.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialEmail}
              placeholder="john@example.com"
            />
            {state?.errors?.email && (
              <p className="text-destructive text-sm font-medium">{state.errors.email[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton label="Guardar Correo" loadingLabel="Guardando..." />
        </CardFooter>
      </form>
    </Card>
  );
}
