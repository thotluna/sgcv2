import { PaginatedUsers, UserFilterInput } from './dtos/user.dtos';

export interface ListUsersService {
  getAll(filter: UserFilterInput): Promise<PaginatedUsers>;
}
