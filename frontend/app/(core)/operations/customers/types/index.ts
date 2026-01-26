import { CreateCustomerSchemaType, UpdateCustomerSchemaType } from '@sgcv2/shared';

export type CustomerCreateInput = CreateCustomerSchemaType;
export type CustomerUpdateInput = UpdateCustomerSchemaType;

export interface CustomerFormValues extends CreateCustomerSchemaType { }

export type CreateCustomerFormData = CreateCustomerSchemaType;
export type UpdateCustomerFormData = UpdateCustomerSchemaType;

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
