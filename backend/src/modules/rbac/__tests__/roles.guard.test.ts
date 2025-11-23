// src/modules/rbac/__tests__/roles.guard.test.ts
import { requireRoles } from '../guards/roles.guard';
import { rbacService } from '../rbac.service';
import { Request, Response, NextFunction } from 'express';

jest.mock('../rbac.service');

const mockReq = { user: { id: 1 } } as unknown as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const nextFn = jest.fn() as NextFunction;

describe('Roles Guard', () => {
  it('allows request when role matches', async () => {
    (rbacService.hasRole as jest.Mock).mockResolvedValue(true);
    await requireRoles('Administrador')(mockReq, mockRes, nextFn);
    expect(nextFn).toHaveBeenCalled();
  });

  it('rejects request when role does not match', async () => {
    (rbacService.hasRole as jest.Mock).mockResolvedValue(false);
    await requireRoles('Gerente')(mockReq, mockRes, nextFn);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
