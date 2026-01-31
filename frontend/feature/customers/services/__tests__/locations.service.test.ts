import { getAllLocations } from '../locations.service';
import { fetchClient } from '@/lib/api/fetch-client';

jest.mock('@/lib/api/fetch-client', () => ({
  fetchClient: jest.fn(),
}));

describe('locations service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLocations', () => {
    it('should fetch locations for a specific customer', async () => {
      (fetchClient as jest.Mock).mockResolvedValue({ success: true, data: [] });

      await getAllLocations('cust-1');

      expect(fetchClient).toHaveBeenCalledWith('/customers/cust-1/locations');
    });

    it('should fetch locations globally if customerId is not provided', async () => {
      (fetchClient as jest.Mock).mockResolvedValue({ success: true, data: [] });

      await getAllLocations();

      expect(fetchClient).toHaveBeenCalledWith('/locations');
    });

    it('should include query parameters in the URL', async () => {
      (fetchClient as jest.Mock).mockResolvedValue({ success: true, data: [] });

      await getAllLocations(undefined, { search: 'Test', page: 2, perPage: 20 });

      const calledUrl = (fetchClient as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain('/locations?');
      expect(calledUrl).toContain('search=Test');
      expect(calledUrl).toContain('page=2');
      expect(calledUrl).toContain('perPage=20');
    });
  });
});
