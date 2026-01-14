import { z } from 'zod';

export const UserFilterSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().optional(),
    status: z
      .preprocess(
        val => (val === '' || val === undefined ? undefined : val),
        z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED'] as const).optional()
      )
      .optional(),
    roleId: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    offset: z.coerce.number().int().min(0).optional().default(0),
  });


export type UserFilterSchemaType = z.infer<typeof UserFilterSchema>;
