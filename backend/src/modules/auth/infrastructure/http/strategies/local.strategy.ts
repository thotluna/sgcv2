import { Strategy as PassportLocalStrategy } from 'passport-local';
import { inject, injectable } from 'inversify';
import { TYPES } from '@modules/auth/di/types';
import { UserValidationService } from '@auth/domain/user-validation.service';

@injectable()
export class LocalStrategy extends PassportLocalStrategy {
  constructor(
    @inject(TYPES.UserValidationService) private validationService: UserValidationService
  ) {
    super(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await this.validationService.validateCredentials(username, password);

          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, {
            id: user.id.toString(),
            username: user.username,
            role: user.roles?.[0] || '',
            roles: user.roles || [],
            permissions: user.permissions || [],
          });
        } catch (err) {
          return done(err);
        }
      }
    );
  }
}
