declare namespace Express {
  interface User {
    id: string;
    username: string;
    role: string;
    roles: string[];
  }

  interface Request {
    id: string;
    user?: User;
  }
}
