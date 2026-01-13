import { z } from 'zod';

export const UpdateUserSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    currentPassword: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    isActive: z.boolean().optional(),
    roleIds: z.array(z.number()).optional(),
  })
  .strict()
  .refine(
    data => {
      if (data.password && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Current password is required to change password',
      path: ['currentPassword'],
    }
  );

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
