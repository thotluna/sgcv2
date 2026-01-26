import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(255, 'Description must be less than 255 characters').optional(),
  permissionIds: z.array(z.number()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(255).optional(),
  permissionIds: z.array(z.number()).optional(),
});

export const roleFilterSchema = z.object({
  search: z.string().optional(),
  pagination: z
    .object({
      limit: z.coerce.number().min(1).default(10),
      offset: z.coerce.number().min(0).default(0),
    })
    .optional(),
});

export const manageRolePermissionsSchema = z.object({
  permissionIds: z.array(z.number()),
});
