export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  id_empleado?: number; // Optional: link to employee
  roleIds?: number[]; // Role IDs to assign
}
