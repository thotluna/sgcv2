import { Request, Response, NextFunction } from 'express';
import { requireRoles, requirePermission } from '../guards/rbac.guard';

describe('RBAC Guards', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('requireRoles', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      const middleware = requireRoles('admin');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have required role', async () => {
      mockRequest.user = {
        usuario_rol: [{ rol: { nombre: 'user' } }],
      };
      const middleware = requireRoles('admin');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Forbidden',
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next if user has required role', async () => {
      mockRequest.user = {
        usuario_rol: [{ rol: { nombre: 'admin' } }],
      };
      const middleware = requireRoles('admin');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should call next if user has one of the required roles', async () => {
      mockRequest.user = {
        usuario_rol: [{ rol: { nombre: 'manager' } }],
      };
      const middleware = requireRoles('admin', 'manager');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Force an error by making user property access throw
      Object.defineProperty(mockRequest, 'user', {
        get: () => {
          throw new Error('Test error');
        },
      });

      const middleware = requireRoles('admin');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Internal Server Error',
        })
      );
    });
  });

  describe('requirePermission', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      const middleware = requirePermission('users', 'create');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 403 if user does not have required permission', async () => {
      mockRequest.user = {
        usuario_rol: [
          {
            rol: {
              rol_permiso: [{ permiso: { modulo: 'users', accion: 'read' } }],
            },
          },
        ],
      };
      const middleware = requirePermission('users', 'create');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Forbidden',
        })
      );
    });

    it('should call next if user has required permission', async () => {
      mockRequest.user = {
        usuario_rol: [
          {
            rol: {
              rol_permiso: [{ permiso: { modulo: 'users', accion: 'create' } }],
            },
          },
        ],
      };
      const middleware = requirePermission('users', 'create');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should check permissions across multiple roles', async () => {
      mockRequest.user = {
        usuario_rol: [
          {
            rol: {
              rol_permiso: [{ permiso: { modulo: 'users', accion: 'read' } }],
            },
          },
          {
            rol: {
              rol_permiso: [{ permiso: { modulo: 'users', accion: 'create' } }],
            },
          },
        ],
      };
      const middleware = requirePermission('users', 'create');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      Object.defineProperty(mockRequest, 'user', {
        get: () => {
          throw new Error('Test error');
        },
      });

      const middleware = requirePermission('users', 'create');

      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
