import { ListPermissionsUseCase } from '@permissions/application/list-permissions.use-case';
import { PermissionsController } from '@permissions/infrastructure/http/permissions.controller';
import { ResponseHelper } from '@shared/utils/response.helpers';
import { Request, Response } from 'express';

import { mockPermission } from '../../helpers';

jest.mock('@shared/utils/response.helpers');

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let useCase: jest.Mocked<ListPermissionsUseCase>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListPermissionsUseCase>;

    controller = new PermissionsController(useCase);

    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    (ResponseHelper.success as jest.Mock).mockImplementation((res, data) => res.json(data));
  });

  describe('getAll', () => {
    it('should call useCase.execute with default filters', async () => {
      useCase.execute.mockResolvedValue([mockPermission]);

      await controller.getAll(req as Request, res as Response);

      expect(useCase.execute).toHaveBeenCalledWith({
        search: undefined,
        page: 1,
        limit: 10,
      });
    });

    it('should parse query parameters correctly', async () => {
      req.query = {
        search: 'test',
        page: '2',
        limit: '20',
      };
      useCase.execute.mockResolvedValue([]);

      await controller.getAll(req as Request, res as Response);

      expect(useCase.execute).toHaveBeenCalledWith({
        search: 'test',
        page: 2,
        limit: 20,
      });
    });

    it('should return mapped permissions through ResponseHelper', async () => {
      useCase.execute.mockResolvedValue([mockPermission]);

      await controller.getAll(req as Request, res as Response);

      expect(ResponseHelper.success).toHaveBeenCalledWith(
        res,
        expect.arrayContaining([
          expect.objectContaining({
            id: mockPermission.id,
            resource: mockPermission.resource,
            action: mockPermission.action,
            description: mockPermission.description,
          }),
        ])
      );
    });

    it('should propagate errors from useCase', async () => {
      const error = new Error('UseCase error');
      useCase.execute.mockRejectedValue(error);

      await expect(controller.getAll(req as Request, res as Response)).rejects.toThrow(error);
    });
  });
});
