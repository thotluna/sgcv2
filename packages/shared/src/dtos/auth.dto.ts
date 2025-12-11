import { UserDto } from './users.dto';

export class LoginDto {
  username!: string;
  password!: string;
}

export class UserTokenDto {
  user!: UserDto;
  token!: string;
}
