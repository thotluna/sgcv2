import { ListPermissionsUseCase } from '../../application/list-permissions.use-case';
import { ListPermissionsService } from '../../domain/list-permissions.service';
import { mockPermission } from '../helpers';

const mockListPermissionsService = {
  getAllPermissions: jest.fn(),
} as unknown as jest.Mocked<ListPermissionsService>;

describe('ListPermissionsUseCase', () => {
  let useCase: ListPermissionsUseCase;

  beforeEach(() => {
    useCase = new ListPermissionsUseCase(mockListPermissionsService);
    jest.clearAllMocks();
  });

  it('should return all permissions', async () => {
    const mockPermissions = [mockPermission];
    mockListPermissionsService.getAllPermissions.mockResolvedValue(mockPermissions);

    const result = await useCase.execute();

    expect(mockListPermissionsService.getAllPermissions).toHaveBeenCalled();
    expect(result).toEqual(mockPermissions);
  });
});
