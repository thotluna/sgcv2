'use client';

import { useActionState, useEffect } from 'react';
import { updateAvatarAction } from '@feature/users/profile.actions';
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

interface AvatarFormProps {
  initialAvatar?: string;
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export function AvatarForm({ initialAvatar }: AvatarFormProps) {
  const [state, formAction] = useActionState(updateAvatarAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Avatar actualizado con éxito');
    } else if (state.message && state.success === false && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
        <CardDescription>Actualiza la URL de tu foto de perfil.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">URL del Avatar</Label>
            <Input
              id="avatar"
              name="avatar"
              defaultValue={initialAvatar || ''}
              placeholder="https://example.com/avatar.png"
            />
            {state?.errors?.avatar && (
              <p className="text-destructive text-sm font-medium">{state.errors.avatar[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton label="Guardar Avatar" loadingLabel="Guardando..." />
        </CardFooter>
      </form>
    </Card>
  );
}
