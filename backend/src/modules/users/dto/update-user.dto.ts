export class UpdateUserDto {
  email?: string;
  password?: string; // Only if changing password
  isActive?: boolean; // Status
  roleIds?: number[]; // Role IDs to update
}
