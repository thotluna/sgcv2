import { Prisma } from '@prisma/client';

export const userInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} as const;

export type UserWithRolesModel = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;
