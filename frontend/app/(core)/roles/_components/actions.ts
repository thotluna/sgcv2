'use server';

import { redirect } from 'next/navigation';
import { serverRolesService } from '@/lib/api/server-roles.service';
import { revalidatePath } from 'next/cache';
import { createRoleSchema, updateRoleSchema } from '@sgcv2/shared';
import { ActionState } from '@/lib/types';

export async function handleRoleFilters(formData: FormData) {
  const search = formData.get('search');

  const params = new URLSearchParams();
  if (search) params.set('search', search.toString());

  const queryString = params.toString();
  redirect(`/roles${queryString ? `?${queryString}` : ''}`);
}

export async function createRoleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const permissionIds = formData.getAll('permissionIds').map(id => Number(id));

  const rawData = {
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString(),
    permissionIds: permissionIds.length > 0 ? permissionIds : undefined,
  };

  const validated = createRoleSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await serverRolesService.create(validated.data);
    revalidatePath('/roles');
    return { success: true, message: 'Rol creado correctamente' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error creando el rol',
    };
  }
}

export async function updateRoleAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const permissionIds = formData.getAll('permissionIds').map(id => Number(id));

  const rawData = {
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString(),
    permissionIds: permissionIds.length > 0 ? permissionIds : undefined,
  };

  const validated = updateRoleSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await serverRolesService.update(id, validated.data);
    revalidatePath('/roles');
    revalidatePath(`/roles/${id}`);
    return { success: true, message: 'Rol actualizado correctamente' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error actualizando el rol',
    };
  }
}

export async function deleteRoleAction(id: number): Promise<ActionState> {
  try {
    await serverRolesService.delete(id);
    revalidatePath('/roles');
    return { success: true, message: 'Rol eliminado correctamente' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error eliminando el rol',
    };
  }
}
