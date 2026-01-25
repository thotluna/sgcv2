'use server';

import { serverCustomersService as customerService } from '@/lib/api/server-customers.service';
import { CreateCustomerSchema, UpdateCustomerSchema } from '@sgcv2/shared';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
};

export async function createCustomerAction(_prevState: any, formData: FormData): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  const validated = CreateCustomerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: {
        message: 'Invalid form data',
      },
    };
  }

  const response = await customerService.create(validated.data);

  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  revalidatePath('/operations/customers');
  return { success: true };
}

export async function updateCustomerAction(
  id: string,
  _prevState: any,
  formData: FormData
): Promise<ActionState> {
   const rawData = Object.fromEntries(formData.entries());

  const validated = UpdateCustomerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: {
        message: 'Invalid form data',
      },
    };
  }

  const response = await customerService.update(id, validated.data);

  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  revalidatePath('/operations/customers');
  revalidatePath(`/operations/customers/${id}`);
  return { success: true };
}

export async function deleteCustomerAction(id: string): Promise<ActionState> {
  const response = await customerService.delete(id);

  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  revalidatePath('/operations/customers');
  return { success: true };
}

export const serverCustomersService = customerService;
