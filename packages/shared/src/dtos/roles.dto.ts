import { PermissionDto } from './permissions.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: admin
 *         description:
 *           type: string
 *           nullable: true
 *           example: System Administrator
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class RoleDto {
  id!: number;
  name!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateRoleDto {
  name!: string;
  description?: string;
  permissionIds?: number[];
}

export class UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

export class RoleWithPermissionsDto extends RoleDto {
  permissions!: PermissionDto[];
}

export class RoleFilterDto {
  search?: string;
  pagination?: {
    limit: number;
    offset: number;
  };
}

export class ManageRolePermissionsDto {
  permissionIds!: number[];
}
