import { z } from 'zod';

import { updatePasswordBaseSchema } from '@sgcv2/shared';

// Extend base password schema for UI confirmation
export const updatePasswordSchema = updatePasswordBaseSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine(
    (data: z.infer<typeof updatePasswordBaseSchema> & { confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );
