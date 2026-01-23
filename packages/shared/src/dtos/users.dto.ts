import { UserStatus } from '../types';
import { RoleDto } from './roles.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: jdoe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Secret123!
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         avatar:
 *           type: string
 *           nullable: true
 *         roleIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BLOCKED]
 *           example: ACTIVE
 */
export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roleIds?: number[];
  status?: UserStatus;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         currentPassword:
 *           type: string
 *           format: password
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         avatar:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BLOCKED]
 *         roleIds:
 *           type: array
 *           items:
 *             type: integer
 */
export type UpdateUserDto = Partial<Omit<UserDto, 'id' | 'createdAt' | 'updatedAt'>> & {
  password?: string;
  currentPassword?: string;
  roleIds?: number[];
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: jdoe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         firstName:
 *           type: string
 *           nullable: true
 *           example: John
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: Doe
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BLOCKED]
 *           example: ACTIVE
 *         avatar:
 *           type: string
 *           nullable: true
 */
export class UserDto {
  id!: number;
  username!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  status!: UserStatus;
  avatar?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserWithRolesDto:
 *       allOf:
 *         - $ref: '#/components/schemas/UserDto'
 *         - type: object
 *           properties:
 *             roles:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoleDto'
 *             permissions:
 *               type: array
 *               items:
 *                 type: string
 *               example: [users.read, users.create]
 */
export class UserWithRolesDto extends UserDto {
  roles?: RoleDto[];
  permissions?: string[];
}

export interface UserFilterDto {
  search?: string;
  status?: UserStatus;
  pagination?: {
    limit: number;
    offset: number;
  };
}
