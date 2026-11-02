// Simple test script to verify pagination logic
const { generatePageNumbers, getPageRange } = require('./utils.js')

console.log('Testing pagination utility functions...\n')

// Test generatePageNumbers
console.log('Test 1: generatePageNumbers with 5 total pages')
console.log('Current page 1:', generatePageNumbers(1, 5))
console.log('Current page 3:', generatePageNumbers(3, 5))
console.log('Current page 5:', generatePageNumbers(5, 5))

console.log('\nTest 2: generatePageNumbers with 10 total pages')
console.log('Current page 1:', generatePageNumbers(1, 10))
console.log('Current page 5:', generatePageNumbers(5, 10))
console.log('Current page 10:', generatePageNumbers(10, 10))

// Test getPageRange
console.log('\nTest 3: getPageRange')
console.log('Page 1, 9 per page, 27 total:', getPageRange(1, 9, 27))
console.log('Page 2, 9 per page, 27 total:', getPageRange(2, 9, 27))
console.log('Page 3, 9 per page, 27 total:', getPageRange(3, 9, 27))

// Test pagination calculation
console.log('\nTest 4: Pagination calculations')
const PROPERTIES_PER_PAGE = 9
const totalCount = 27

for (let page = 1; page <= 3; page++) {
  const start = (page - 1) * PROPERTIES_PER_PAGE
  const end = start + PROPERTIES_PER_PAGE
  const totalPages = Math.ceil(totalCount / PROPERTIES_PER_PAGE)
  
  console.log(`Page ${page}:`)
  console.log(`  - GROQ slice: [${start}...${end}]`)
  console.log(`  - Display range: ${getPageRange(page, PROPERTIES_PER_PAGE, totalCount)}`)
  console.log(`  - Total pages: ${totalPages}`)
}

console.log('\n✅ All tests completed!')
