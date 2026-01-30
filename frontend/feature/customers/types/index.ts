import { CreateCustomerSchemaType, UpdateCustomerSchemaType } from '@sgcv2/shared';

import { ActionState as GlobalActionState } from '@/lib/types';

export type CustomerCreateInput = CreateCustomerSchemaType;
export type CustomerUpdateInput = UpdateCustomerSchemaType;

export type CustomerFormValues = CreateCustomerSchemaType;

export type CreateCustomerFormData = CreateCustomerSchemaType;
export type UpdateCustomerFormData = UpdateCustomerSchemaType;

export type ActionState = GlobalActionState;
