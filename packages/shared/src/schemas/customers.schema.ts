import { z } from 'zod';
import { CustomerState } from '../types/customers.type';

// --- CUSTOMER SCHEMAS ---

export const CreateCustomerSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be at most 50 characters'),
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(255, 'Business name must be at most 255 characters'),
  legalName: z
    .string()
    .min(1, 'Legal name is required')
    .max(255, 'Legal name must be at most 255 characters'),
  taxId: z.string().min(1, 'Tax ID is required').max(50, 'Tax ID must be at most 50 characters'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address must be at most 500 characters'),
  phone: z.string().max(20, 'Phone must be at most 20 characters').optional().nullable(),
});

export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;

export const UpdateCustomerSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name must not be empty')
    .max(255, 'Business name must be at most 255 characters')
    .optional(),
  legalName: z
    .string()
    .min(1, 'Legal name must not be empty')
    .max(255, 'Legal name must be at most 255 characters')
    .optional(),
  taxId: z
    .string()
    .min(1, 'Tax ID must not be empty')
    .max(50, 'Tax ID must be at most 50 characters')
    .optional(),
  address: z
    .string()
    .min(1, 'Address must not be empty')
    .max(500, 'Address must be at most 500 characters')
    .optional(),
  phone: z.string().max(20, 'Phone must be at most 20 characters').optional().nullable(),
  state: z.nativeEnum(CustomerState).optional(),
});

export type UpdateCustomerSchemaType = z.infer<typeof UpdateCustomerSchema>;

export const CustomerFilterSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  perPage: z.string().regex(/^\d+$/).transform(Number).optional(),
  state: z.nativeEnum(CustomerState).optional(),
  search: z.string().max(255).optional(),
});

export type CustomerFilterSchemaType = z.infer<typeof CustomerFilterSchema>;

// --- SUB-CUSTOMER SCHEMAS ---

export const CreateSubCustomerSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be at most 100 characters'),
  externalCode: z
    .string()
    .min(1, 'External code is required')
    .max(10, 'External code must be at most 10 characters'),
});

export type CreateSubCustomerSchemaType = z.infer<typeof CreateSubCustomerSchema>;

export const UpdateSubCustomerSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be at most 100 characters')
    .optional(),
  externalCode: z
    .string()
    .min(1, 'External code is required')
    .max(10, 'External code must be at most 10 characters')
    .optional(),
});

export type UpdateSubCustomerSchemaType = z.infer<typeof UpdateSubCustomerSchema>;

export const SubCustomerFilterSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(10),
});

export type SubCustomerFilterSchemaType = z.infer<typeof SubCustomerFilterSchema>;

// --- CUSTOMER LOCATION SCHEMAS ---

export const CreateCustomerLocationSchema = z.object({
  subCustomerId: z.string().uuid().optional().nullable(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address must be at most 255 characters'),
});

export type CreateCustomerLocationSchemaType = z.infer<typeof CreateCustomerLocationSchema>;

export const UpdateCustomerLocationSchema = z.object({
  subCustomerId: z.string().uuid().optional().nullable(),
  name: z.string().min(1, 'Name must not be empty').max(100).optional(),
  address: z.string().min(1, 'Address must not be empty').max(255).optional(),
});

export type UpdateCustomerLocationSchemaType = z.infer<typeof UpdateCustomerLocationSchema>;

export const CustomerLocationFilterSchema = z.object({
  search: z.string().max(255).optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(10),
});

export type CustomerLocationFilterSchemaType = z.infer<typeof CustomerLocationFilterSchema>;
