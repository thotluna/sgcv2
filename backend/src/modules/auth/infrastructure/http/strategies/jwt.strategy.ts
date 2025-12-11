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
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    });
  }
}
