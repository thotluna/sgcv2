import { UserStatus } from '../types';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: admin
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 */
export class LoginDto {
  username!: string;
  password!: string;
}

export class UserTokenDto<T> {
  user!: T;
  token!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthenticatedUserDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: admin
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BLOCKED]
 *           example: ACTIVE
 *         avatar:
 *           type: string
 *           nullable: true
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           example: [admin, manager]
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: [users.create, users.read]
 */
export class AuthenticatedUserDto {
  id!: number;
  username!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  status!: UserStatus;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}
