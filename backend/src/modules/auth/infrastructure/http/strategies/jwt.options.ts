import { ExtractJwt, StrategyOptions } from 'passport-jwt';

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['auth-token'];
  }
  return token;
};

export const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.JWT_SECRET || 'default_secret',
};
