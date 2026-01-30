import { z } from 'zod';

export const permissionFilterSchema = z.object({
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export type PermissionFilterSchemaDto = z.infer<typeof permissionFilterSchema>;
