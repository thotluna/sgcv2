import { render, screen } from '@testing-library/react';
import { PermissionsTableContent } from '../table-content';
import { getAllPermissions } from '../../service';
import '@testing-library/jest-dom';

jest.mock('../../service', () => ({
  getAllPermissions: jest.fn(),
}));

jest.mock('../permissions-table', () => ({
  PermissionsTable: ({ data }: any) => (
    <div data-testid="permissions-table">{data.length} items</div>
  ),
}));

jest.mock('@/components/data-pagination', () => ({
  DataPagination: ({ currentPage, totalPages }: any) => (
    <div data-testid="pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

describe('PermissionsTableContent', () => {
  const mockFilter = { search: '' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display permissions', async () => {
    const mockData = [{ id: 1, resource: 'res1', action: 'act1', description: 'desc1' }];
    (getAllPermissions as jest.Mock).mockResolvedValue({
      success: true,
      data: mockData,
      metadata: { pagination: { totalPages: 1 } },
    });

    const Result = await PermissionsTableContent({ limit: 10, offset: 0, filter: mockFilter });
    render(Result);

    expect(getAllPermissions).toHaveBeenCalledWith(mockFilter);
    expect(screen.getByTestId('permissions-table')).toHaveTextContent('1 items');
    expect(screen.getByTestId('pagination')).toHaveTextContent('Page 1 of 1');
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (getAllPermissions as jest.Mock).mockRejectedValue(new Error('API Error'));

    const Result = await PermissionsTableContent({ limit: 10, offset: 0, filter: mockFilter });
    render(Result);

    expect(screen.getByTestId('permissions-table')).toHaveTextContent('0 items');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should calculate current page correctly', async () => {
    (getAllPermissions as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      metadata: { pagination: { totalPages: 5 } },
    });

    // offset 10, limit 10 should be page 2
    const Result = await PermissionsTableContent({ limit: 10, offset: 10, filter: mockFilter });
    render(Result);

    expect(screen.getByTestId('pagination')).toHaveTextContent('Page 2 of 5');
  });
});
