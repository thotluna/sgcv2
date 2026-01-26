'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAvatarAction } from '@feature/users/profile.actions';

import { updateAvatarSchema } from '@sgcv2/shared';
import {
  Button,
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
import { z } from 'zod';

type AvatarValues = z.infer<typeof updateAvatarSchema>;

interface AvatarFormProps {
  initialAvatar?: string;
}

export function AvatarForm({ initialAvatar }: AvatarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AvatarValues>({
    resolver: zodResolver(updateAvatarSchema),
    defaultValues: {
      avatar: initialAvatar || '',
    },
  });

  const onSubmit = async (data: AvatarValues) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar || '');

    const result = await updateAvatarAction(formData);
    if (result.success) {
      toast.success('Avatar updated successfully');
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Update your profile picture URL (currently using Gravatar by default).
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              {...register('avatar')}
              placeholder="https://example.com/avatar.png"
            />
            {errors.avatar && <p className="text-destructive text-sm">{errors.avatar.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Avatar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
