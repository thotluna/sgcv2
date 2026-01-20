'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createRoleSchema,
  CreateRoleDto,
  PermissionDto,
  RoleWithPermissionsDto,
} from '@sgcv2/shared';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { createRoleAction, updateRoleAction } from './actions';
import { toast } from 'sonner';
import { useState } from 'react';

interface RoleFormProps {
  initialData?: RoleWithPermissionsDto;
  permissions: PermissionDto[];
}

export function RoleForm({ initialData, permissions }: RoleFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateRoleDto>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      permissionIds: initialData?.permissions?.map(p => p.id) || [],
    },
  });

  const onSubmit = async (data: CreateRoleDto) => {
    setIsPending(true);
    try {
      const result = initialData
        ? await updateRoleAction(initialData.id, data)
        : await createRoleAction(data);

      if (result.success) {
        toast.success(initialData ? 'Rol actualizado' : 'Rol creado');
        router.push('/roles');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsPending(false);
    }
  };

  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      const resource = permission.resource;
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push(permission);
      return acc;
    },
    {} as Record<string, PermissionDto[]>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Rol</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Administrador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe las responsabilidades de este rol..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel className="text-base font-semibold">Permisos</FormLabel>
          <FormDescription>Selecciona los permisos que tendrá este rol.</FormDescription>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <div key={resource} className="space-y-3 p-4 border rounded-lg bg-card/50">
                <h3 className="font-bold capitalize text-sm">{resource}</h3>
                <div className="space-y-2">
                  {perms.map(permission => (
                    <FormField
                      key={permission.id}
                      control={form.control}
                      name="permissionIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={permission.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(permission.id)}
                                onCheckedChange={(checked: boolean) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), permission.id])
                                    : field.onChange(
                                        field.value?.filter(value => value !== permission.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {permission.action}
                              {permission.description && (
                                <span className="block text-xs text-muted-foreground">
                                  {permission.description}
                                </span>
                              )}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {form.formState.errors.permissionIds && (
            <FormMessage>{form.formState.errors.permissionIds.message}</FormMessage>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando...' : initialData ? 'Actualizar Rol' : 'Crear Rol'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
