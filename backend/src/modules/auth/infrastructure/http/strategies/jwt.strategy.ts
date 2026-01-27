import { TYPES } from '@auth/di/types';
import { jwtOptions } from '@auth/infrastructure/http/strategies/jwt.options';
import { AuthUserIdentityRepository } from '@modules/auth/domain/auth-user-identity.repository';
import { inject, injectable } from 'inversify';
import { Strategy as PassportJwtStrategy, VerifiedCallback } from 'passport-jwt';

export interface Payload {
  sub: number;
  username: string;
  roles: string[];
  iat: number;
  exp: number;
}

@injectable()
export class JwtStrategy extends PassportJwtStrategy {
  constructor(
    @inject(TYPES.AuthUserIdentityRepository) userRepository: AuthUserIdentityRepository
  ) {
    super(jwtOptions as any, async (payload: Payload, done: VerifiedCallback) => {
      try {
        const user = await userRepository.findByIdForAuth(payload.sub);

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
