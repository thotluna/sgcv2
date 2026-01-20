import { z } from 'zod';

export const userStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']);

export const userFilterSchema = z.object({
  search: z.string().optional(),
  status: userStatusEnum.optional(),
  roleId: z.coerce.number().int().positive().optional(),
  pagination: z
    .object({
      limit: z.coerce.number().min(1).default(10),
      offset: z.coerce.number().min(0).default(0),
    })
    .optional(),
});

export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  avatar: z.string().url().optional().or(z.literal('')),
  status: userStatusEnum.optional().default('ACTIVE'),
  roleIds: z.array(z.number()).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  currentPassword: z.string().optional(),
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  avatar: z.string().url().optional().or(z.literal('')),
  status: userStatusEnum.optional(),
  roleIds: z.array(z.number()).optional(),
});
