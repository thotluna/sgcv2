import { render, screen } from '@testing-library/react';
import { TablePagination } from '../table-pagination';
import '@testing-library/jest-dom';

// Mocks
jest.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

describe('TablePagination', () => {
  it('renders correct page links', () => {
    // Current page 1, 5 total pages. Expect links for 1, 2, 3...
    render(<TablePagination currentPage={1} totalPages={5} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('generates correct URLs', () => {
    render(<TablePagination currentPage={1} totalPages={5} />);

    const link2 = screen.getByRole('link', { name: '2' });
    expect(link2).toHaveAttribute('href', '/test-path?page=2');
  });

  it('disables Previous button on first page', () => {
    render(<TablePagination currentPage={1} totalPages={5} />);

    // PaginationPrevious usually has an aria-label or accessible text "Go to previous page"
    // shadcn implementation: Check "Previous" text or role
    const prevButton = screen.getByLabelText('Go to previous page');
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables Next button on last page', () => {
    render(<TablePagination currentPage={5} totalPages={5} />);

    const nextButton = screen.getByLabelText('Go to next page');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders ellipsis for many pages', () => {
    // Page 5 of 20. Expect visible range + ellipsis
    render(<TablePagination currentPage={5} totalPages={20} />);

    // shadcn usually renders visually hidden text or generic "More pages" for ellipsis
    // we can check if there are list items
    const ellipsis = screen.getAllByText('More pages'); // Based on typical shadcn rendering
    expect(ellipsis.length).toBeGreaterThan(0);
  });
});
