import { AuthenticatedUserDto } from '@sgcv2/shared/src/dtos/auth.dto';

export interface UserValidationService {
  validateCredentials(username: string, password: string): Promise<AuthenticatedUserDto | null>;
}
