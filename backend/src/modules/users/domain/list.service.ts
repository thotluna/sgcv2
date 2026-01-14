import { UserFilterInput } from "./dtos/user.dtos";
import { UserEntity } from "./user-entity";

export interface ListUsersService {
  getAll(filter: UserFilterInput): Promise<UserEntity[]>;
}