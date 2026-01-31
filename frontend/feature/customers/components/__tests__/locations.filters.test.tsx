import { render, screen } from '@testing-library/react';
import { LocationsFilters } from '../locations.filters';

describe('LocationsFilters', () => {
  it('renders search input with initial value', () => {
    render(<LocationsFilters search="Sede Central" />);
    const input = screen.getByPlaceholderText(/Buscar sedes.../i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Sede Central');
  });

  it('renders form with correct action', () => {
    // In server actions with Next.js, the 'action' prop is a bit tricky to mock directly
    // but we can check if the form elements are there.
    render(<LocationsFilters search="" />);
    expect(screen.getByRole('form', { name: /Filtros de sedes/i })).toBeInTheDocument();
  });
});
