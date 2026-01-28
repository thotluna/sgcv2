import { z } from 'zod';
import { CustomerState } from '../types/customers.type';

// --- CUSTOMER SCHEMAS ---

export const CreateCustomerSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(5, 'Code must be at most 5 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be alphanumeric and uppercase'),
  businessName: z
    .string()
    .min(3, 'Business name must be at least 3 characters')
    .max(50, 'Business name must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  legalName: z
    .string()
    .min(3, 'Legal name must be at least 3 characters')
    .max(100, 'Legal name must be at most 100 characters'),
  taxId: z.string().regex(/^[VEPJG]-[0-9]{8}-[0-9]$/, 'Invalid Tax ID format. Use: V-12345678-9'),
  address: z
    .string()
    .min(3, 'Address must be at least 3 characters')
    .max(255, 'Address must be at most 255 characters'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 characters')
    .max(15, 'Phone must be at most 15 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;

export const UpdateCustomerSchema = CreateCustomerSchema.partial().extend({
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

export const CreateSubCustomerWithLocationSchema = CreateSubCustomerSchema.extend({
  locationName: z
    .string()
    .min(1, 'Location name is required')
    .max(100, 'Location name must be at most 100 characters'),
  locationAddress: z
    .string()
    .min(1, 'Location address is required')
    .max(255, 'Location address must be at most 255 characters'),
  locationCity: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be at most 100 characters'),
});

export type CreateSubCustomerWithLocationSchemaType = z.infer<
  typeof CreateSubCustomerWithLocationSchema
>;

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
  city: z.string().min(1, 'City is required').max(100, 'City must be at most 100 characters'),
  zipCode: z.string().max(20).optional().nullable(),
  isMain: z.boolean().optional(),
});

export type CreateCustomerLocationSchemaType = z.infer<typeof CreateCustomerLocationSchema>;

export const UpdateCustomerLocationSchema = z.object({
  subCustomerId: z.string().uuid().optional().nullable(),
  name: z.string().min(1, 'Name must not be empty').max(100).optional(),
  address: z.string().min(1, 'Address must not be empty').max(255).optional(),
  city: z.string().min(1, 'City must not be empty').max(100).optional(),
  zipCode: z.string().max(20).optional().nullable(),
  isMain: z.boolean().optional(),
});

export type UpdateCustomerLocationSchemaType = z.infer<typeof UpdateCustomerLocationSchema>;

export const CustomerLocationFilterSchema = z.object({
  search: z.string().max(255).optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(10),
});

export type CustomerLocationFilterSchemaType = z.infer<typeof CustomerLocationFilterSchema>;
