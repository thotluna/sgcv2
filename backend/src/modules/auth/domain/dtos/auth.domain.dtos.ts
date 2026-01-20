export interface LoginInput {
  username: string;
  password: string;
}

export interface AuthResult<T> {
  user: T;
  token: string;
}
