import { ListUseCase } from '@modules/users/application/list.use-case';
import { ListUsersService } from '@modules/users/domain/list.service';

const mockService = {
  getAll: jest.fn(),
};

describe('ListUseCase', () => {
  let useCase: ListUseCase;

  beforeEach(() => {
    useCase = new ListUseCase(mockService as unknown as ListUsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated users', async () => {
    const mockResponse = { users: [{ id: 1, username: 'test' }], total: 1 } as any;
    mockService.getAll.mockResolvedValue(mockResponse);

    const filter = { search: 'test' };
    const result = await useCase.execute(filter);

    expect(result).toEqual(mockResponse);
    expect(mockService.getAll).toHaveBeenCalledWith(filter);
  });
});
