'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateAvatarSchema } from '../_schemas/profile.schema';
import { updateAvatarAction } from '../_actions/profile.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { z } from 'zod';

type AvatarValues = z.infer<typeof UpdateAvatarSchema>;

interface AvatarFormProps {
  initialAvatar?: string;
}

export function AvatarForm({ initialAvatar }: AvatarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AvatarValues>({
    resolver: zodResolver(UpdateAvatarSchema),
    defaultValues: {
      avatarUrl: initialAvatar || '',
    },
  });

  const onSubmit = async (data: AvatarValues) => {
    const formData = new FormData();
    formData.append('avatarUrl', data.avatarUrl || '');

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
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              {...register('avatarUrl')}
              placeholder="https://example.com/avatar.png"
            />
            {errors.avatarUrl && (
              <p className="text-destructive text-sm">{errors.avatarUrl.message}</p>
            )}
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
