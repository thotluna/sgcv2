import { Strategy as LocalStrategy } from 'passport-local';
import { AuthService, AuthServiceImp } from '../auth.service';

export const createLocalStrategy = (authService: AuthService) => {
  return new LocalStrategy(
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
};

export const localStrategy = createLocalStrategy(new AuthServiceImp());
