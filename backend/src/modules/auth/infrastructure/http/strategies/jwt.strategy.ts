import { Strategy as PassportJwtStrategy, VerifiedCallback } from 'passport-jwt';
import { inject, injectable } from 'inversify';
import { jwtOptions } from '@auth/infrastructure/http/strategies/jwt.options';
import { TYPES } from '@auth/di/types';
import { AuthUserIdentityRepository } from '@modules/auth/domain/auth-user-identity.repository';

export interface Payload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

@injectable()
export class JwtStrategy extends PassportJwtStrategy {
  constructor(
    @inject(TYPES.AuthUserIdentityRepository) userRepository: AuthUserIdentityRepository
  ) {
    super(jwtOptions, async (payload: Payload, done: VerifiedCallback) => {
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
