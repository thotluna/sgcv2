import { ErrorCodes } from '../enums/error-codes.enum';
import { AppException } from './app.exception';

export class NotFoundException extends AppException {
  constructor(message: string = 'Resource not found', details?: Record<string, any>) {
    super(404, ErrorCodes.NOT_FOUND, message, details);
  }
}

export class BadRequestException extends AppException {
  constructor(message: string = 'Bad request', details?: Record<string, any>) {
    super(400, ErrorCodes.BAD_REQUEST, message, details);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized', details?: Record<string, any>) {
    super(401, ErrorCodes.UNAUTHORIZED, message, details);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden', details?: Record<string, any>) {
    super(403, ErrorCodes.FORBIDDEN, message, details);
  }
}

export class ConflictException extends AppException {
  constructor(message: string = 'Conflict', details?: Record<string, any>) {
    super(409, ErrorCodes.CONFLICT, message, details);
  }
}

export class ValidationException extends AppException {
  constructor(message: string, details?: Record<string, any>) {
    super(400, ErrorCodes.VALIDATION_ERROR, message, details);
  }
}

export class InternalServerErrorException extends AppException {
  constructor(message: string = 'Internal server error', details?: Record<string, any>) {
    super(500, ErrorCodes.INTERNAL_SERVER_ERROR, message, details);
  }
}

export class UnprocessableEntityException extends AppException {
  constructor(message: string = 'Unprocessable entity', details?: Record<string, any>) {
    super(422, ErrorCodes.UNPROCESSABLE_ENTITY, message, details);
  }
}
