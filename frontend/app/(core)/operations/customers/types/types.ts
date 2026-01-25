import { CreateCustomerSchemaType, UpdateCustomerSchemaType } from '@sgcv2/shared';

export type CustomerCreateInput = CreateCustomerSchemaType;
export type CustomerUpdateInput = UpdateCustomerSchemaType;

export interface CustomerFormValues extends CreateCustomerSchemaType {}
