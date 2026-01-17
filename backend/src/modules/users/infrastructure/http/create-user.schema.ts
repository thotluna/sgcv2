import { z } from 'zod';

export const CreateUserSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional().default('ACTIVE'),
  })
  .strict();

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
