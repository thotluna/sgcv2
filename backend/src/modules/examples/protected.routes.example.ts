import { Router } from 'express';
import { authenticate } from '../auth/middleware/auth.middleware';
import { requireRoles, requirePermission } from '../auth/guards/rbac.guard';

const router = Router();

/**
 * Example of a protected route that requires authentication
 */
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

/**
 * Example of a route that requires specific roles
 */
router.get('/admin-only', authenticate, requireRoles('Administrador'), (_req, res) => {
    res.json({ message: 'This route is only for administrators' });
});

/**
 * Example of a route that requires specific permissions
 */
router.post('/create-ods', authenticate, requirePermission('ODS', 'CREAR'), (_req, res) => {
    res.json({ message: 'ODS created successfully' });
});

/**
 * Example of a route that requires multiple roles
 */
router.get('/management', authenticate, requireRoles('Administrador', 'Gerente'), (_req, res) => {
    res.json({ message: 'This route is for administrators and managers' });
});

export default router;
