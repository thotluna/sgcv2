import { render, screen, fireEvent } from '@testing-library/react';
import { TableHeader } from '../table-header';
import '@testing-library/jest-dom';

// Mocks
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

describe('TableHeader', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders correctly', () => {
    render(
      <TableHeader
        header={{ id: 'name', label: 'Name', isOrderable: false }}
        currentSortBy="created_at"
        currentSortOrder="desc"
      />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('calls router.push with correct sort params when clicked', () => {
    // 1. Initial State: No sort
    render(<TableHeader header={{ id: 'name', label: 'Name', isOrderable: true }} />);

    const button = screen.getByRole('button', { name: /Name/ });
    fireEvent.click(button);

    // Expect: set sortBy=name, sortOrder=asc
    expect(mockPush).toHaveBeenCalledWith('/test-path?sortBy=name&sortOrder=asc&page=1');
  });

  it('toggles sort order appropriately', () => {
    // 1. State: Already sorted by name (asc)
    render(
      <TableHeader
        header={{ id: 'name', label: 'Name', isOrderable: true }}
        currentSortBy="name"
        currentSortOrder="asc"
      />
    );

    const button = screen.getByRole('button', { name: /Name/ });
    fireEvent.click(button);

    // Expect: switch to desc
    expect(mockPush).toHaveBeenCalledWith('/test-path?sortOrder=desc&page=1');
  });

  it('does NOT sort if isOrderable is false', () => {
    render(<TableHeader header={{ id: 'name', label: 'Name', isOrderable: false }} />);

    // Should render as span, not button. testing-library might fail looking for button.
    const element = screen.getByText('Name');
    expect(element.tagName).toBe('SPAN');

    // Attempt click anyway
    fireEvent.click(element);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
