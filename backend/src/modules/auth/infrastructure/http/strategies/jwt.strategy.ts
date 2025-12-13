import { Strategy as PassportJwtStrategy, VerifiedCallback } from 'passport-jwt';
import { injectable } from 'inversify';
import { jwtOptions } from './jwt.options';
import { prisma } from '@config/prisma';

export interface Payload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

@injectable()
export class JwtStrategy extends PassportJwtStrategy {
  constructor() {
    super(jwtOptions, async (payload: Payload, done: VerifiedCallback) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });

        if (!user) {
          return done(null, false);
        }

        const userWithRoles = {
          ...user,
          roles: user.roles.map(ur => ur.role.name), // transform to array of role names
        };

        return done(null, userWithRoles);
      } catch (err) {
        return done(err, false);
      }
    });
  }
}
