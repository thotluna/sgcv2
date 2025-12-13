import { Strategy as PassportLocalStrategy } from 'passport-local';
import { inject, injectable } from 'inversify';
import { ValidationService } from '@auth/domain/validation-service';
import { TYPES } from '@auth/di/types';

@injectable()
export class LocalStrategy extends PassportLocalStrategy {
  constructor(@inject(TYPES.ValidationService) private validationService: ValidationService) {
    super(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await this.validationService.validateUser(username, password);

          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, {
            id: user.id.toString(),
            username: user.username,
            role: '',
            roles: [] // Default logical role for initial login, JWT strategy will hydrate full roles
          });
        } catch (err) {
          return done(err);
        }
      }
    );
  }
}
