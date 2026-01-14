import { CreateUserInput } from './dtos/user.dtos';
import { UserEntity } from './user-entity';

export interface CreateUserService {
  create(data: CreateUserInput): Promise<UserEntity>;
}
