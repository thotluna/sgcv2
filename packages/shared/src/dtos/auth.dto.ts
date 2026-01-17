import { UserStatus } from '../types';

export class LoginDto {
  username!: string;
  password!: string;
}

export class UserTokenDto<T> {
  user!: T;
  token!: string;
}

export class AuthenticatedUserDto {
  id!: number;
  username!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  status!: UserStatus;
  avatar?: string;
  roles?: string[];
}
