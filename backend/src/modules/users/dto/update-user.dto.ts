export class UpdateUserDto {
  email?: string;
  password?: string; // Only if changing password
  estado?: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO'; // Status
  roleIds?: number[]; // Role IDs to update
}
