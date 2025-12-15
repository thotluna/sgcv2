import { UserStatus } from '@sgcv2/shared';

export interface AuthenticatedUserDto {
  id: number;
  username: string;
  status: UserStatus;
  roles: string[];
}
