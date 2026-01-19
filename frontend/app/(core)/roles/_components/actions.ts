'use server';

import { redirect } from 'next/navigation';
import { serverRolesService } from '@/lib/api/server-roles.service';
import { revalidatePath } from 'next/cache';
import { CreateRoleDto, UpdateRoleDto } from '@sgcv2/shared';

export async function handleRoleFilters(formData: FormData) {
  const search = formData.get('search');

  const params = new URLSearchParams();
  if (search) params.set('search', search.toString());

  const queryString = params.toString();
  redirect(`/roles${queryString ? `?${queryString}` : ''}`);
}

export async function createRoleAction(data: CreateRoleDto) {
  try {
    await serverRolesService.create(data);
    revalidatePath('/roles');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error creating role' };
  }
}

export async function updateRoleAction(id: number, data: UpdateRoleDto) {
  try {
    await serverRolesService.update(id, data);
    revalidatePath('/roles');
    revalidatePath(`/roles/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error updating role' };
  }
}

export async function deleteRoleAction(id: number) {
  try {
    await serverRolesService.delete(id);
    revalidatePath('/roles');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error deleting role' };
  }
}
