import { render, screen } from '@testing-library/react';
import PermissionsPage from '../page';
import '@testing-library/jest-dom';

jest.mock('@feature/permissions/components', () => ({
  PermissionsFilters: () => <div data-testid="permissions-filters">Filters</div>,
  PermissionsTableContent: () => <div data-testid="permissions-table-content">Table Content</div>,
}));

describe('PermissionsPage', () => {
  it('should render the page title and children components', async () => {
    const Page = await PermissionsPage({ searchParams: Promise.resolve({}) });
    render(Page);

    expect(screen.getByText('Permisos')).toBeInTheDocument();
    expect(screen.getByTestId('permissions-filters')).toBeInTheDocument();
    expect(screen.getByTestId('permissions-table-content')).toBeInTheDocument();
  });

  it('should handle searchParams correctly', async () => {
    const searchParams = Promise.resolve({ search: 'test', offset: '10', limit: '20' });
    const Page = await PermissionsPage({ searchParams });
    render(Page);

    // We can't easily check props of mocked async RSCs in this setup without more complex mocking,
    // but we verify the page renders with these params.
    expect(screen.getByText('Permisos')).toBeInTheDocument();
    expect(screen.getByTestId('permissions-table-content')).toBeInTheDocument();
  });
});
