import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { authenticate, optionalAuth } from '../../../infrastructure/http/auth.middleware';
import { InternalServerErrorException, UnauthorizedException } from '@shared/exceptions';

// Mock passport
jest.mock('passport');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should call next if authentication is successful', () => {
      const mockUser = { id: '1', username: 'test', roles: ['admin'], role: 'admin' };

      // Mock passport.authenticate to return a middleware that calls the callback with success
      (passport.authenticate as jest.Mock).mockImplementation((_strategy, _options, callback) => {
        return (_req: Request, _res: Response, _next: NextFunction) => {
          callback(null, mockUser, null);
        };
      });

      authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(passport.authenticate).toHaveBeenCalledWith(
        'jwt',
        { session: false },
        expect.any(Function)
      );
      expect(mockRequest.user).toEqual(mockUser);
      expect(nextFunction).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 if authentication fails (no user)', () => {
      // Mock passport.authenticate to return a middleware that calls the callback with no user
      (passport.authenticate as jest.Mock).mockImplementation((_strategy, _options, callback) => {
        return (_req: Request, _res: Response, _next: NextFunction) => {
          callback(null, false, { message: 'Invalid token' });
        };
      });

      authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe('Invalid token');
    });

    it('should return 401 with default message if info message is missing', () => {
      (passport.authenticate as jest.Mock).mockImplementation((_strategy, _options, callback) => {
        return (_req: Request, _res: Response, _next: NextFunction) => {
          callback(null, false, undefined);
        };
      });

      authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe('Invalid or missing token');
    });

    it('should return 500 if an error occurs during authentication', () => {
      // Mock passport.authenticate to return a middleware that calls the callback with an error
      (passport.authenticate as jest.Mock).mockImplementation((_strategy, _options, callback) => {
        return (_req: Request, _res: Response, _next: NextFunction) => {
          callback(new Error('Auth error'), null, null);
        };
      });

      authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(InternalServerErrorException));
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe('Authentication error');
    });
  });

  describe('optionalAuth', () => {
    it('should set user and call next if authentication is successful', () => {
      const mockUser = { id: '1', username: 'test', roles: ['admin'], role: 'admin' };

      (passport.authenticate as jest.Mock).mockImplementation((_strategy, _options, callback) => {
        return (_req: Request, _res: Response, _next: NextFunction) => {
          callback(null, mockUser, null);
        };
      });

      optionalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.user).toEqual(mockUser);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should call next without setting user if authentication fails', () => {
      (passport.authenticate as jest.Mock).mockImplementation((_strategy, _options, callback) => {
        return (_req: Request, _res: Response, _next: NextFunction) => {
          callback(null, false, { message: 'Invalid token' });
        };
      });

      optionalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should call next without setting user if an error occurs', () => {
      (passport.authenticate as jest.Mock).mockImplementation((_strategy, _options, callback) => {
        return (_req: Request, _res: Response, _next: NextFunction) => {
          callback(new Error('Auth error'), null, null);
        };
      });

      optionalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
