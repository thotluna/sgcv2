'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverCustomersService } from '@/lib/api/server-customers.service';
import {
  CreateCustomerSchema as createSchema,
  UpdateCustomerSchema as updateSchema,
  UpdateCustomerDto,
} from '@sgcv2/shared';

export type ActionState = {
  success?: boolean;
  fieldErrors?: { [key: string]: string[] };
  message?: string;
};

export async function createCustomerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Extract data from FormData
  const rawData = Object.fromEntries(formData.entries());

  // Validate with Zod
  const validatedFields = createSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación',
    };
  }

  const response = await serverCustomersService.create(validatedFields.data);

  if (!response.success) {
    return {
      success: false,
      message: response.error?.message || 'Error al crear el cliente',
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

  const validatedFields = updateSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación',
    };
  }

  const response = await serverCustomersService.update(
    id,
    validatedFields.data as UpdateCustomerDto
  );

  if (!response.success) {
    return {
      success: false,
      message: response.error?.message || 'Error al actualizar el cliente',
    };
  }

  revalidatePath('/operations/customers');
  revalidatePath(`/operations/customers/${id}`);
  redirect(`/operations/customers/${id}`);
}
