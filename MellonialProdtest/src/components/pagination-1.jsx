"use client";
import React from "react";

function Pagination1({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-400 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <i className="fas fa-chevron-left mr-1" aria-hidden="true"></i>
        <span className="sm:block hidden">Previous</span>
      </button>

      <div
        className="flex flex-wrap items-center gap-1"
        role="group"
        aria-label="Page navigation"
      >
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === "number" ? onPageChange(page) : null
            }
            disabled={page === currentPage || page === "..."}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={
              typeof page === "number" ? `Go to page ${page}` : "More pages"
            }
            className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                page === currentPage
                  ? "bg-blue-500 text-white focus:ring-blue-500"
                  : page === "..."
                  ? "cursor-default"
                  : "bg-gray-100 hover:bg-gray-200 focus:ring-gray-500"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-400 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <span className="sm:block hidden">Next</span>
        <i className="fas fa-chevron-right ml-1" aria-hidden="true"></i>
      </button>
    </nav>
  );
}

function Pagination1Story() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-8 p-4">
      <div>
        <h3 className="mb-4 text-lg font-medium">Few Pages (5 total)</h3>
        <Pagination1
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Many Pages (20 total)</h3>
        <Pagination1
          currentPage={currentPage}
          totalPages={20}
          onPageChange={setCurrentPage}
        />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Edge Case (1 page)</h3>
        <Pagination1
          currentPage={1}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Pagination1;