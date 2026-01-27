'use client';

import { useActionState, useEffect } from 'react';
import { PermissionDto, RoleWithPermissionsDto } from '@sgcv2/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { createRoleAction, updateRoleAction } from './actions';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/submit-button';

interface RoleFormProps {
  initialData?: RoleWithPermissionsDto;
  permissions: PermissionDto[];
}

export function RoleForm({ initialData, permissions }: RoleFormProps) {
  const router = useRouter();

  const action = initialData ? updateRoleAction.bind(null, initialData.id) : createRoleAction;

  const [state, formAction] = useActionState(action, { success: false });

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);

      // If we are editing, we are already on the page?
      // Actually /roles/[id] for edit?
      // The original code redirected to /roles.
      // So we redirect back to the list.
      router.push('/roles');
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

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
    <form action={formAction} className="space-y-8 max-w-2xl">
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Nombre del Rol
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Ej. Administrador"
            defaultValue={initialData?.name}
          />
          {state.errors?.name && (
            <p className="text-sm font-medium text-destructive">{state.errors.name.join(', ')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Descripción
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe las responsabilidades de este rol..."
            defaultValue={initialData?.description}
          />
          {state.errors?.description && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.description.join(', ')}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-base font-semibold">Permisos</label>
        <p className="text-sm text-muted-foreground">
          Selecciona los permisos que tendrá este rol.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {Object.entries(groupedPermissions).map(([resource, perms]) => (
            <div key={resource} className="space-y-3 p-4 border rounded-lg bg-card/50">
              <h3 className="font-bold capitalize text-sm">{resource}</h3>
              <div className="space-y-2">
                {perms.map(permission => (
                  <div
                    key={permission.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <Checkbox
                      id={`perm-${permission.id}`}
                      name="permissionIds"
                      value={String(permission.id)}
                      defaultChecked={initialData?.permissions?.some(p => p.id === permission.id)}
                    />
                    <label
                      htmlFor={`perm-${permission.id}`}
                      className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-1"
                    >
                      {permission.action}
                      {permission.description && (
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {permission.description}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {state.errors?.permissionIds && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.permissionIds.join(', ')}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <SubmitButton
          label={initialData ? 'Actualizar Rol' : 'Crear Rol'}
          loadingLabel="Guardando..."
        />
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
