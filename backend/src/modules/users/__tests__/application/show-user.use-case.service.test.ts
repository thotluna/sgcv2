import { ShowUserUseCaseService } from '../../application/show-user.use-case.service';
import { ShowUserService } from '../../domain/show.service';

describe('ShowUserUseCaseService', () => {
  let service: ShowUserUseCaseService;
  let userService: jest.Mocked<ShowUserService>;

  beforeEach(() => {
    userService = {
      getUserWithRoles: jest.fn(),
    } as any;
    service = new ShowUserUseCaseService(userService);
  });

  it('should call userService.getUserWithRoles with correct id', async () => {
    const id = 1;
    await service.execute(id);
    expect(userService.getUserWithRoles).toHaveBeenCalledWith(id);
  });

  it('should return the user if found', async () => {
    const id = 1;
    const user = { id, email: 'test@example.com' };
    userService.getUserWithRoles.mockResolvedValue(user as any);

    const result = await service.execute(id);

    expect(result).toEqual(user);
  });

  it('should return null if user not found', async () => {
    const id = 1;
    userService.getUserWithRoles.mockResolvedValue(null);

    const result = await service.execute(id);

    expect(result).toBeNull();
  });
});
