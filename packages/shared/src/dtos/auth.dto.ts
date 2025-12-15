export class LoginDto {
  username!: string;
  password!: string;
}

export class UserTokenDto<T> {
  user!: T;
  token!: string;
}
