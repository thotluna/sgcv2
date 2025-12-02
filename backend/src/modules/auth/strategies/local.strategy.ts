import { Strategy as PassportLocalStrategy } from 'passport-local';
import { inject, injectable } from 'inversify';
import { AuthService } from '../auth.service';
import { TYPES } from '../types';

@injectable()
export class LocalStrategy extends PassportLocalStrategy {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {
    super(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await this.authService.validateUser(username, password);

          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    );
  }
}
