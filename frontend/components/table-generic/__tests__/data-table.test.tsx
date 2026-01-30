import { render } from '@testing-library/react';
import { DataTable } from '../data-table';
import { DataTablePageObject } from '../data-table.page-object';
import { TableColumn } from '../types';
import '@testing-library/jest-dom';

// Mock next/navigation for TableHeader and TablePagination
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

interface TestData {
  id: string;
  name: string;
  status: string;
}

const mockColumns: TableColumn<TestData>[] = [
  { id: 'id', label: 'ID', isOrderable: true },
  { id: 'name', label: 'Name', isOrderable: true },
  { id: 'status', label: 'Status', isOrderable: false },
];

describe('DataTable', () => {
  const pageObject = new DataTablePageObject();

  it('renders data correctly', async () => {
    const mockData = [
      { id: '1', name: 'Item 1', status: 'Active' },
      { id: '2', name: 'Item 2', status: 'Inactive' },
    ];

    // Server Component needs to be called as a function (await)
    const Component = await DataTable({
      fetchData: jest.fn().mockResolvedValue({
        success: true,
        data: mockData,
        metadata: { pagination: { total: 2, perPage: 10, currentPage: 1, totalPages: 1 } },
      }),
      headers: mockColumns,
      searchParams: {},
    });

    render(Component);

    pageObject.expectHeader('ID');
    pageObject.expectHeader('Name');
    pageObject.expectRowCount(2);
    pageObject.expectDataVisible('Item 1');
    pageObject.expectDataVisible('Item 2');
  });

  it('renders custom cell content correctly', async () => {
    const customColumns: TableColumn<TestData>[] = [
      { id: 'name', label: 'Name', isOrderable: false },
      {
        id: 'status',
        label: 'Status',
        isOrderable: false,
        cell: item => <span data-testid="custom-badge">Badge: {item.status}</span>,
      },
    ];

    const mockData = [{ id: '1', name: 'Item 1', status: 'Active' }];

    const Component = await DataTable({
      fetchData: jest.fn().mockResolvedValue({
        success: true,
        data: mockData,
        metadata: { pagination: { total: 1, perPage: 10, currentPage: 1, totalPages: 1 } },
      }),
      headers: customColumns,
      searchParams: {},
    });

    render(Component);

    pageObject.expectDataVisible('Badge: Active');
  });

  it('renders empty state when no data', async () => {
    const Component = await DataTable({
      fetchData: jest.fn().mockResolvedValue({
        success: true,
        data: [],
        metadata: { pagination: { total: 0, perPage: 10, currentPage: 1, totalPages: 0 } },
      }),
      headers: mockColumns,
      searchParams: {},
    });

    render(Component);

    pageObject.expectEmptyState('No hay datos disponibles');
  });

  it('renders error message when fetch fails', async () => {
    const Component = await DataTable({
      fetchData: jest.fn().mockResolvedValue({
        success: false,
        error: { message: 'API Failed', code: '500' },
      }),
      headers: mockColumns,
      searchParams: {},
    });

    render(Component);

    pageObject.expectErrorMessage('API Failed');
  });
});
