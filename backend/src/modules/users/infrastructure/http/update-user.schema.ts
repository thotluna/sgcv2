import { z } from 'zod';

const userStateEnum = z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']);

export const UpdateMeSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    currentPassword: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    isActive: userStateEnum.optional(),
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

export const AdminUpdateUserSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    isActive: userStateEnum.optional(),
    roleIds: z.array(z.number()).optional(),
  })
  .strict();

export type UpdateMeSchemaType = z.infer<typeof UpdateMeSchema>;
export type AdminUpdateUserSchemaType = z.infer<typeof AdminUpdateUserSchema>;
