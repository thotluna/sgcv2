'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEmailAction } from '@feature/users';
import { updateEmailSchema } from '@sgcv2/shared';
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

type EmailValues = z.infer<typeof updateEmailSchema>;

interface EmailFormProps {
  initialEmail: string;
}

export function EmailForm({ initialEmail }: EmailFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const onSubmit = async (data: EmailValues) => {
    const formData = new FormData();
    formData.append('email', data.email);

    const result = await updateEmailAction(formData);
    if (result.success) {
      toast.success('Email updated successfully');
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Address</CardTitle>
        <CardDescription>Update your account email address.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="email@example.com" />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Email'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
