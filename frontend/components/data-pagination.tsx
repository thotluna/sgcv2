import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  createPageUrl?: (page: number) => string;
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
  createPageUrl,
}: DataPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const PageLink = ({
    page,
    children,
    disabled = false,
    isActive = false,
    className = '',
  }: {
    page: number;
    children: React.ReactNode;
    disabled?: boolean;
    isActive?: boolean;
    className?: string;
  }) => {
    const props = {
      href: createPageUrl ? createPageUrl(page) : '#',
      onClick: (e: React.MouseEvent) => {
        if (!createPageUrl) e.preventDefault();
        if (!disabled && onPageChange) onPageChange(page);
      },
      isActive,
      className: cn(className, disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'),
    };

    if (children === 'Next') return <PaginationNext {...props} />;
    if (children === 'Previous') return <PaginationPrevious {...props} />;

    return <PaginationLink {...props}>{children}</PaginationLink>;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PageLink page={currentPage - 1} disabled={currentPage === 1}>
            Previous
          </PageLink>
        </PaginationItem>

        {getPageNumbers().map((page, index) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PageLink page={page as number} isActive={currentPage === page}>
                {page}
              </PageLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PageLink page={currentPage + 1} disabled={currentPage === totalPages}>
            Next
          </PageLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
