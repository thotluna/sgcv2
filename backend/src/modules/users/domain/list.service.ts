import { UserFilterInput, PaginatedUsers } from "./dtos/user.dtos";

export interface ListUsersService {
  getAll(filter: UserFilterInput): Promise<PaginatedUsers>;
}