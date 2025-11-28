export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  roleIds?: number[]; // Role IDs to assign
}
