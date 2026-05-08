'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque transition-all hover:shadow-md"
          aria-label="Previous page"
        >
          <span className="material-icons text-lg">chevron_left</span>
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark/30 cursor-not-allowed">
          <span className="material-icons text-lg">chevron_left</span>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={`/?page=${page}`}
          className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all ${
            page === currentPage
              ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/20'
              : 'bg-white border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque hover:shadow-md'
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque transition-all hover:shadow-md"
          aria-label="Next page"
        >
          <span className="material-icons text-lg">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark/30 cursor-not-allowed">
          <span className="material-icons text-lg">chevron_right</span>
        </span>
      )}
    </div>
  );
}
