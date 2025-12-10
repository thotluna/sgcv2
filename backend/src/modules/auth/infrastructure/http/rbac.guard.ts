import { Request, Response, NextFunction } from 'express';

export const requireRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user as any;

      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const userRoles = user.usuario_rol?.map((ur: any) => ur.rol.nombre) || [];

      const hasRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({
          error: 'Forbidden',
          message: `Required roles: ${allowedRoles.join(', ')}`,
        });
      }

      return next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error checking user roles',
      });
    }
  };
};

export const requirePermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user as any;

      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const userRoles = user.usuario_rol || [];

      let hasPermission = false;

      for (const userRole of userRoles) {
        const rolePermissions = userRole.rol?.rol_permiso || [];

        hasPermission = rolePermissions.some(
          (rp: any) => rp.permiso.modulo === module && rp.permiso.accion === action
        );

        if (hasPermission) break;
      }

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Forbidden',
          message: `Required permission: ${module}.${action}`,
        });
      }

      return next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error checking user permissions',
      });
    }
  };
};
