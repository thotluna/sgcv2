import { Strategy as JwtStrategy } from 'passport-jwt';
import { jwtOptions } from './jwt.options';
import { prisma } from '../../../config/prisma';

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload: any, done) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { id_usuario: payload.sub } });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});
