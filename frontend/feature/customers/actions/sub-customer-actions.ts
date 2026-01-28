'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { CreateCustomerLocationSchema, CreateSubCustomerWithLocationSchema } from '@sgcv2/shared';

import { ActionState } from '@/feature/customers/types';
import { serverLocationsService } from '@/lib/api/server-locations.service';
import { serverSubCustomersService } from '@/lib/api/server-subcustomers.service';

export async function createSubCustomerWithLocationAction(
  parentId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validated = CreateSubCustomerWithLocationSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // 1. Create SubCustomer
  const subCustomerResponse = await serverSubCustomersService.create(parentId, {
    businessName: validated.data.businessName,
    externalCode: validated.data.externalCode,
  });

  if (!subCustomerResponse.success || !subCustomerResponse.data) {
    return {
      success: false,
      message: subCustomerResponse.error?.message || 'Error al crear el sub-cliente',
    };
  }

  const subCustomerId = subCustomerResponse.data.id;

  // 2. Create Initial Location
  const locationResponse = await serverLocationsService.create(parentId, {
    subCustomerId,
    name: validated.data.locationName,
    address: validated.data.locationAddress,
    city: validated.data.locationCity,
    isMain: true,
  });

  if (!locationResponse.success) {
    return {
      success: false,
      message: `Sub-cliente creado (ID: ${validated.data.externalCode}), pero error al crear la sede: ${locationResponse.error?.message}`,
    };
  }

  revalidatePath(`/operations/customers/${parentId}`);
  redirect(`/operations/customers/${parentId}`);
}

export async function createLocationAction(
  parentId: string,
  subCustomerId: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validated = CreateCustomerLocationSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const response = await serverLocationsService.create(parentId, {
    ...validated.data,
    subCustomerId,
  });

  if (!response.success) {
    return {
      success: false,
      message: response.error?.message || 'Error al crear la sede',
    };
  }

  revalidatePath(`/operations/customers/${parentId}`);
  redirect(`/operations/customers/${parentId}`);
}

export async function deleteLocationAction(id: string, parentId: string): Promise<ActionState> {
  const response = await serverLocationsService.delete(id);

  if (!response.success) {
    return {
      success: false,
      message: response.error?.message || 'Error al eliminar la sede',
    };
  }

  revalidatePath(`/operations/customers/${parentId}`);
  return { success: true };
}

export async function deleteSubCustomerAction(
  id: string,
  parentId: string,
  customerId: string
): Promise<ActionState> {
  const response = await serverSubCustomersService.delete(customerId, id);

  if (!response.success) {
    return {
      success: false,
      message: response.error?.message || 'Error al eliminar el sub-cliente',
    };
  }

  revalidatePath(`/operations/customers/${parentId}`);
  return { success: true };
}
