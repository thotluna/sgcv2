export class PermissionDto {
  id!: number;
  resource!: string;
  action!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PermissionFilterDto {
  resource?: string;
  action?: string;
}
