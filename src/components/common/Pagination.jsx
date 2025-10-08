import React from 'react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5 // Show max 5 page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)
      
      // Adjust if we're near the beginning or end
      if (end - start < 4) {
        if (start === 1) {
          end = Math.min(totalPages, start + 4)
        } else {
          start = Math.max(1, end - 4)
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => !isFirst && onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
          isFirst
            ? 'text-slate-400 cursor-not-allowed'
            : 'text-slate-700 hover:text-primary hover:bg-slate-50'
        }`}
      >
        <span>‹</span>
        <span>Prev</span>
      </button>

      {/* Page Numbers Container */}
      <div className="flex items-center bg-slate-50 rounded-xl p-1">
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
              pageNum === currentPage
                ? 'bg-white text-slate-900 shadow-sm border-b-2 border-primary'
                : 'text-primary hover:text-slate-900 hover:bg-white'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => !isLast && onPageChange(currentPage + 1)}
        disabled={isLast}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
          isLast
            ? 'text-slate-400 cursor-not-allowed'
            : 'text-slate-700 hover:text-primary hover:bg-slate-50'
        }`}
      >
        <span>Next</span>
        <span>›</span>
      </button>
    </div>
  )
}


