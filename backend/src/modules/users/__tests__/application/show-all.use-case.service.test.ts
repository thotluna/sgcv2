import { ShowAllUseCaseService } from '@modules/users/application/show-all.use-case.service';
import { ListUsersService } from '@modules/users/domain/list.service';

const mockService = {
  getAll: jest.fn(),
};

describe('ShowAllUseCaseService', () => {
  let useCase: ShowAllUseCaseService;

  beforeEach(() => {
    useCase = new ShowAllUseCaseService(mockService as unknown as ListUsersService);
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
