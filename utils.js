export const isMultiple = (value) => (value === 0 || value > 1 ? "s" : "")

export const generatePageNumbers = (currentPage, totalPages) => {
  const pages = []
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (currentPage > 3) {
      pages.push('...')
    }
    
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    
    pages.push(totalPages)
  }
  
  return pages
}

export const getPageRange = (currentPage, perPage, totalCount) => {
  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, totalCount)
  return `${start}-${end} of ${totalCount}`
}

