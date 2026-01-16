import { z } from 'zod';

export const UserFilterSchema = z.object({
  search: z.string().optional(),
  status: z
    .preprocess(
      val => (val === '' || val === undefined ? undefined : val),
      z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED'] as const).optional()
    )
    .optional(),
  roleId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export type UserFilterSchemaType = z.infer<typeof UserFilterSchema>;
