import { z } from 'zod';

export const UpdateEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const UpdateAvatarSchema = z.object({
  avatarUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const UpdateRoleSchema = z.object({
  roleIds: z.array(z.number()),
});
