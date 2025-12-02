import { Strategy as PassportJwtStrategy } from 'passport-jwt';
import { jwtOptions } from './jwt.options';
import { prisma } from '../../../config/prisma';
import { injectable } from 'inversify';

@injectable()
export class JwtStrategy extends PassportJwtStrategy {
  constructor() {
    super(jwtOptions, async (payload: any, done: any) => {
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
