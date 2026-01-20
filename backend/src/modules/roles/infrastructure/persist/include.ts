import { Prisma } from '@prisma/client';

export const roleInclude = {
  permissions: {
    include: {
      permission: true,
    },
  },
} as const;

export type RoleWithPermissionsModel = Prisma.RoleGetPayload<{
  include: typeof roleInclude;
}>;
