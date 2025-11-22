import { Strategy as LocalStrategy } from 'passport-local';
import { AuthService } from '../auth.service';

const authService = new AuthService();

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username: string, password: string, done) => {
    try {
      const user = await authService.validateUser(username, password);

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
