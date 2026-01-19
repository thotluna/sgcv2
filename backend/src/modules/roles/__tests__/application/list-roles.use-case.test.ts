import { ListRolesUseCase } from '@roles/application/list-roles.use-case';
import { ListService } from '@roles/domain/list.service';
import { mockRole } from '@roles/__tests__/helpers';

const mockListService = {
  getListRoles: jest.fn(),
} as unknown as jest.Mocked<ListService>;

describe('ListRolesUseCase', () => {
  let useCase: ListRolesUseCase;

  beforeEach(() => {
    useCase = new ListRolesUseCase(mockListService);
    jest.clearAllMocks();
  });

  it('should list roles with filters', async () => {
    const filter = { search: 'Admin', page: 1, limit: 10 };
    const mockResult = { items: [mockRole], total: 1 };
    mockListService.getListRoles.mockResolvedValue(mockResult);

    const result = await useCase.execute(filter);

    expect(mockListService.getListRoles).toHaveBeenCalledWith(filter);
    expect(result).toEqual(mockResult);
  });
});
