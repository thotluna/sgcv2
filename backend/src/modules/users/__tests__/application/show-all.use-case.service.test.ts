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

  it('should return a list of users', async () => {
    const mockUsers = [{ id: 1, username: 'test' }] as any;
    mockService.getAll.mockResolvedValue(mockUsers);

    const filter = { username: 'test' };
    const result = await useCase.execute(filter);

    expect(result).toEqual(mockUsers);
    expect(mockService.getAll).toHaveBeenCalledWith(filter);
  });
});
