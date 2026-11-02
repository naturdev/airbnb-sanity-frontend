# Pagination Implementation

This document explains the server-side pagination implementation for property listings.

## Overview

The pagination system allows users to browse through properties in manageable chunks (9 properties per page) while maintaining good performance and SEO.

## Key Components

### 1. Server-Side Logic (`pages/index.js`)

```javascript
const PROPERTIES_PER_PAGE = 9

export const getServerSideProps = async (context) => {
  const page = parseInt(context.query.page) || 1
  const start = (page - 1) * PROPERTIES_PER_PAGE
  const end = start + PROPERTIES_PER_PAGE

  // Paginated query for feed
  const query = `*[ _type == "property"] | order(_createdAt desc) [${start}...${end}]`
  
  // Count query for total pages
  const countQuery = 'count(*[ _type == "property"])'
  
  // Optimized query for map (all properties, minimal fields)
  const mapQuery = '*[ _type == "property"]{ _id, location, title, pricePerNight }'
}
```

**Key Features:**
- Extracts page number from URL query parameter (`/?page=2`)
- Calculates slice indices for GROQ query
- Fetches only required properties for current page
- Fetches total count for pagination controls
- Fetches all properties (optimized) for map display

### 2. Pagination Component (`components/Pagination.js`)

Renders pagination controls with:
- Previous/Next buttons (disabled at boundaries)
- Smart page number display with ellipsis
- Active page highlighting
- Client-side navigation using Next.js Link

**Page Number Logic:**
- Shows all pages if ≤7 total pages
- For >7 pages: shows first, last, current, and adjacent pages
- Uses ellipsis (`...`) for gaps

### 3. Utility Functions (`utils.js`)

```javascript
// Generate array of page numbers to display
generatePageNumbers(currentPage, totalPages)

// Format result count display
getPageRange(currentPage, perPage, totalCount)
```

## GROQ Query Syntax

Sanity's GROQ uses zero-indexed, end-exclusive slice syntax:

```groq
*[ _type == "property"] | order(_createdAt desc) [0...9]
```

This returns items 0-8 (9 items total).

## URL Structure

- Page 1: `/` or `/?page=1`
- Page 2: `/?page=2`
- Page N: `/?page=N`

URLs are bookmarkable and shareable.

## Performance Considerations

1. **Paginated Feed**: Only fetches 9 properties per page
2. **Optimized Map Query**: Fetches all properties but only necessary fields
3. **Server-Side Rendering**: Ensures SEO-friendly pagination
4. **Client-Side Navigation**: Uses Next.js Link for fast page transitions

## Styling

Pagination styles in `styles/globals.css`:
- `.pagination` - Container
- `.pagination-button` - Previous/Next buttons
- `.pagination-number` - Page number links
- `.pagination-active` - Active page (Airbnb red #FF385C)
- `.results-counter` - Result count display

## Example Usage

```jsx
<Pagination currentPage={2} totalPages={5} />
```

Renders: `[Previous] [1] [2] [3] [4] [5] [Next]`

With page 2 highlighted and Previous enabled, Next enabled.

## Testing

Run the test script to verify pagination logic:

```bash
node test-pagination.js
```

## Future Enhancements

- Add sorting options (price, reviews, date)
- Implement filtering with pagination
- Add "Jump to page" input
- Consider infinite scroll as alternative
- Add loading states during transitions
