// src/modules/rbac/__tests__/permissions.guard.test.ts
import { requirePermission } from '../guards/permissions.guard';
import { rbacService } from '../rbac.service';
import { Request, Response, NextFunction } from 'express';

jest.mock('../rbac.service');

const mockReq = { user: { id: 1 } } as unknown as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const nextFn = jest.fn() as NextFunction;

describe('Permissions Guard', () => {
  it('allows request when permission exists', async () => {
    (rbacService.hasPermission as jest.Mock).mockResolvedValue(true);
    await requirePermission('ODS', 'CREAR')(mockReq, mockRes, nextFn);
    expect(nextFn).toHaveBeenCalled();
  });

  it('rejects request when permission missing', async () => {
    (rbacService.hasPermission as jest.Mock).mockResolvedValue(false);
    await requirePermission('ODS', 'ELIMINAR')(mockReq, mockRes, nextFn);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
