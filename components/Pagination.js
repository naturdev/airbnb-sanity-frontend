import Link from "next/link"

const Pagination = ({ currentPage, totalPages }) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = []
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="pagination">
      <Link href={`/?page=${currentPage - 1}`}>
        <button 
          className="pagination-button" 
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </Link>
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
        }
        
        return (
          <Link key={page} href={`/?page=${page}`}>
            <a className={`pagination-number ${currentPage === page ? 'pagination-active' : ''}`}>
              {page}
            </a>
          </Link>
        )
      })}
      
      <Link href={`/?page=${currentPage + 1}`}>
        <button 
          className="pagination-button" 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </Link>
    </div>
  )
}

export default Pagination
