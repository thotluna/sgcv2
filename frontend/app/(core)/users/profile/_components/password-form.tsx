'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updatePasswordAction } from '../_actions/profile.actions';
import { UpdatePasswordSchema } from '../_schemas/profile.schema';

type PasswordValues = z.infer<typeof UpdatePasswordSchema>;

export function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordValues) => {
    const formData = new FormData();
    formData.append('currentPassword', data.currentPassword);
    formData.append('newPassword', data.newPassword);
    formData.append('confirmPassword', data.confirmPassword);

    const result = await updatePasswordAction(formData);
    if (result.success) {
      toast.success('Password updated successfully');
      reset();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to stay secure.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" {...register('currentPassword')} />
            {errors.currentPassword && (
              <p className="text-destructive text-sm">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register('newPassword')} />
            {errors.newPassword && (
              <p className="text-destructive text-sm">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
