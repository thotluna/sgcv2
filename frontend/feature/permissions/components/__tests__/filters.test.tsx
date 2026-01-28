import { render, screen, fireEvent } from '@testing-library/react';
import { PermissionsFilters } from '../filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { handlePermissionFilters } from '../../actions';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../actions', () => ({
  handlePermissionFilters: jest.fn(),
}));

jest.mock('use-debounce', () => ({
  useDebounce: (value: any) => [value],
}));

describe('PermissionsFilters', () => {
  let mockRouter: any;
  let mockSearchParams: any;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    mockSearchParams = new URLSearchParams();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    jest.clearAllMocks();
  });

  it('should render the search input', () => {
    render(<PermissionsFilters />);
    expect(screen.getByPlaceholderText('Buscar permisos...')).toBeInTheDocument();
  });

  it('should update input value when typing', () => {
    render(<PermissionsFilters />);
    const input = screen.getByPlaceholderText('Buscar permisos...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });

  it('should call handlePermissionFilters when value changes', () => {
    render(<PermissionsFilters />);
    const input = screen.getByPlaceholderText('Buscar permisos...');
    fireEvent.change(input, { target: { value: 'new-search' } });

    expect(handlePermissionFilters).toHaveBeenCalledWith(
      mockRouter,
      mockSearchParams,
      'new-search'
    );
  });

  it('should initialize with search from props', () => {
    render(<PermissionsFilters search="initial" />);
    const input = screen.getByPlaceholderText('Buscar permisos...') as HTMLInputElement;
    expect(input.value).toBe('initial');
  });
});
