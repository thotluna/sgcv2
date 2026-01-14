'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ActionResult, createUser, getUser, updateUser } from './actions';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  isActive: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  userId?: number;
}

export function UserForm({ userId }: UserFormProps) {
  const [isOpen, setIsOpen] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEditMode = !!userId;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      isActive: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (userId) {
      // eslint-disable-next-line
      setIsOpen(true);
      const fetchUser = async () => {
        const result = await getUser(userId);
        if (result.success && result.data) {
          const user = result.data;
          setValue('username', user.username);
          setValue('email', user.email);
          setValue('firstName', user.firstName || '');
          setValue('lastName', user.lastName || '');
          setValue('isActive', user.isActive);
          setValue('password', ''); // Clear password field
        } else {
          setError(result.error || 'Failed to fetch user');
        }
      };
      fetchUser();
    }
  }, [userId, setValue]);

  const onSubmit = async (values: UserFormValues) => {
    setError(null);

    let result: ActionResult;

    if (isEditMode) {
      // For updates, only send password if it's not empty
      const updateData = { ...values };
      if (!updateData.password) {
        delete updateData.password;
      }
      result = await updateUser(userId, updateData);
    } else {
      if (!values.password) {
        setError('Password is required for new users');
        return;
      }
      result = await createUser({
        ...values,
        password: values.password,
      });
    }

    if (result.success) {
      reset();
      setIsOpen(false);
      if (isEditMode) {
        router.push('/users'); // Clear userId from URL
      }
      router.refresh();
    } else {
      setError(result.error || `Failed to ${isEditMode ? 'update' : 'create'} user`);
    }
  };

  const handleToggle = () => {
    if (isOpen && isEditMode) {
      router.push('/users');
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      setError(null);
      reset();
    }
  };

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
        <Button variant={isOpen ? 'outline' : 'default'} onClick={handleToggle}>
          {isOpen ? 'Cancelar' : isEditMode ? 'Editar' : 'Crear Usuario'}
        </Button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register('username')}
              placeholder="jdoe"
              disabled={isEditMode}
            />
            {errors.username && (
              <p className="text-destructive text-xs">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {isEditMode && '(Dejar en blanco para mantener actual)'}
            </Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Estado</Label>
            <select
              id="isActive"
              {...register('isActive')}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="BLOCKED">Bloqueado</option>
            </select>
            {errors.isActive && (
              <p className="text-destructive text-xs">{errors.isActive.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" {...register('firstName')} placeholder="John" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" {...register('lastName')} placeholder="Doe" />
          </div>

          {error && <p className="text-destructive text-sm col-span-full">{error}</p>}

          <div className="col-span-full pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (isEditMode ? 'Actualizando...' : 'Creando...') : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
