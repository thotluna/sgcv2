'use server';

import { ActionState } from '../types/types';
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
  customerService,
} from '@sgcv2/shared';
import { serverCustomersService } from '@/lib/api/server-customers.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCustomerAction(
  _prevState: any,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  const validated = CreateCustomerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Error de validación',
    };
  }

  const response = await serverCustomersService.create(validated.data);

  if (response.error) {
    return {
      message: response.error,
    };
  }

  revalidatePath('/operations/customers');
  redirect('/operations/customers');
}

export async function updateCustomerAction(
  id: string,
  _prevState: any,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  // Convert empty values to undefined for partial update if needed
  // or use the schema to handle it.
  const validated = UpdateCustomerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Error de validación',
    };
  }

  const response = await serverCustomersService.update(id, validated.data);

  if (response.error) {
    return {
      message: response.error,
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
      message: response.error,
    };
  }

  revalidatePath('/operations/customers');
  return { success: true };
}
