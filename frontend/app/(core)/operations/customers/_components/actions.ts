'use server';

import { ActionState } from '../types';
import { CreateCustomerSchema, UpdateCustomerSchema } from '@sgcv2/shared';
import { serverCustomersService } from '@/lib/api/server-customers.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function handleCustomerFilters(formData: FormData) {
  const search = formData.get('search') as string;
  const status = formData.get('status') as string;

  const params = new URLSearchParams();

  if (search && search.trim() !== '') {
    params.set('search', search.trim());
  }

  if (status && status !== '') {
    params.set('status', status);
  }

  const queryString = params.toString();
  redirect(`/operations/customers${queryString ? `?${queryString}` : ''}`);
}

export async function createCustomerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  const validated = CreateCustomerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const response = await serverCustomersService.create(validated.data);

  if (response.error) {
    return {
      success: false,
      message: response.error.message,
    };
  }

  revalidatePath('/operations/customers');
  redirect('/operations/customers');
}

export async function updateCustomerAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  // Convert empty values to undefined for partial update if needed
  // or use the schema to handle it.
  const validated = UpdateCustomerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const response = await serverCustomersService.update(id, validated.data);

  if (response.error) {
    return {
      success: false,
      message: response.error.message,
    };
  }

  revalidatePath('/operations/customers');
  revalidatePath(`/operations/customers/${id}`);
  redirect(`/operations/customers/${id}`);
}

export async function deleteCustomerAction(id: string): Promise<ActionState> {
  const response = await serverCustomersService.delete(id);

  if (response.error) {
    return {
      success: false,
      message: response.error.message,
    };
  }

  revalidatePath('/operations/customers');
  return { success: true };
}
