import { UserEntity } from './user-entity';
import { CreateUserInput } from './dtos/user.dtos';

export interface CreateUserService {
  create(data: CreateUserInput): Promise<UserEntity>;
}
