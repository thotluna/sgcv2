import { AuthenticatedUserDto } from '@auth/infrastructure/http/authenticated-user.dto';

export interface UserValidationService {
  validateCredentials(username: string, password: string): Promise<AuthenticatedUserDto | null>;
}
