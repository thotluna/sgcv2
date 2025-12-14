import { requirePermission } from '../guards/permissions.guard';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '@shared/exceptions';

// Mock the entire rbac.service module
jest.mock('../rbac.service', () => ({
  rbacService: {
    hasPermission: jest.fn(),
  },
}));

import { rbacService } from '../rbac.service';

const mockReq = { user: { id: 1 } } as unknown as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const nextFn = jest.fn() as NextFunction;

describe('Permissions Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows request when permission exists', async () => {
    (rbacService.hasPermission as jest.Mock).mockResolvedValue(true);
    await requirePermission('ODS', 'CREAR')(mockReq, mockRes, nextFn);
    expect(nextFn).toHaveBeenCalled();
  });

  it('rejects request when permission missing', async () => {
    (rbacService.hasPermission as jest.Mock).mockResolvedValue(false);
    await requirePermission('ODS', 'ELIMINAR')(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalledWith(expect.any(ForbiddenException));
    const error = (nextFn as jest.Mock).mock.calls[0][0];
    expect(error.message).toContain('Required permission: ODS.ELIMINAR');
  });
});
