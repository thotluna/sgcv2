import { render, screen } from '@testing-library/react';
import LocationsPage from '../page';

// Mocks
jest.mock('@/feature/customers/services/locations.service');
jest.mock('@feature/customers/components/locations-columns', () => ({
  getLocationsColumns: jest.fn(() => []),
}));
jest.mock('@feature/customers/components/locations.filters', () => ({
  LocationsFilters: ({ search }: { search?: string }) => (
    <div data-testid="filters">Filters: {search}</div>
  ),
}));
jest.mock('@/components/table-generic', () => ({
  DataTable: () => <div data-testid="data-table">DataTable</div>,
  TableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('LocationsPage (Server Component)', () => {
  it('renders header, filters and DataTable', async () => {
    const searchParams = Promise.resolve({ search: 'Sede A' });
    const jsx = await LocationsPage({ searchParams });
    render(jsx);

    expect(screen.getByText('Sedes')).toBeInTheDocument();
    expect(screen.getByText('Listado global de todas las sedes del sistema.')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toHaveTextContent('Filters: Sede A');
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('handles empty search parameters', async () => {
    const searchParams = Promise.resolve({});
    const jsx = await LocationsPage({ searchParams });
    render(jsx);

    expect(screen.getByTestId('filters')).toHaveTextContent('Filters:');
  });
});
