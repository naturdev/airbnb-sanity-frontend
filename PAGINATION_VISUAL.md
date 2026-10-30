# Pagination Visual Examples

## Example 1: Page 1 of 3
```
┌─────────────────────────────────────────────────────────┐
│ Places to stay near you                                 │
│ Showing 1-9 of 27 properties                           │
│                                                         │
│ [Property 1] [Property 2] [Property 3]                 │
│ [Property 4] [Property 5] [Property 6]                 │
│ [Property 7] [Property 8] [Property 9]                 │
│                                                         │
│ [Previous (disabled)] [1 (active)] [2] [3] [Next]     │
└─────────────────────────────────────────────────────────┘
```

## Example 2: Page 2 of 3
```
┌─────────────────────────────────────────────────────────┐
│ Places to stay near you                                 │
│ Showing 10-18 of 27 properties                         │
│                                                         │
│ [Property 10] [Property 11] [Property 12]              │
│ [Property 13] [Property 14] [Property 15]              │
│ [Property 16] [Property 17] [Property 18]              │
│                                                         │
│ [Previous] [1] [2 (active)] [3] [Next]                │
└─────────────────────────────────────────────────────────┘
```

## Example 3: Page 3 of 3
```
┌─────────────────────────────────────────────────────────┐
│ Places to stay near you                                 │
│ Showing 19-27 of 27 properties                         │
│                                                         │
│ [Property 19] [Property 20] [Property 21]              │
│ [Property 22] [Property 23] [Property 24]              │
│ [Property 25] [Property 26] [Property 27]              │
│                                                         │
│ [Previous] [1] [2] [3 (active)] [Next (disabled)]     │
└─────────────────────────────────────────────────────────┘
```

## Example 4: Page 5 of 10 (with ellipsis)
```
┌─────────────────────────────────────────────────────────┐
│ Places to stay near you                                 │
│ Showing 37-45 of 90 properties                         │
│                                                         │
│ [Property Grid...]                                      │
│                                                         │
│ [Previous] [1] [...] [4] [5 (active)] [6] [...] [10] [Next] │
└─────────────────────────────────────────────────────────┘
```

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         NavBar                              │
├──────────────────────────────────┬──────────────────────────┤
│         Feed Container           │          Map             │
│         (50% width)              │       (50% width)        │
│                                  │                          │
│  ┌────────────────────────────┐ │  ┌────────────────────┐ │
│  │ Places to stay near you    │ │  │                    │ │
│  │ Showing X-Y of Z properties│ │  │   Google Map       │ │
│  └────────────────────────────┘ │  │   (All Properties) │ │
│                                  │  │                    │ │
│  ┌────────────────────────────┐ │  │                    │ │
│  │   Property Cards (3x3)     │ │  │                    │ │
│  │   [Card] [Card] [Card]     │ │  │                    │ │
│  │   [Card] [Card] [Card]     │ │  │                    │ │
│  │   [Card] [Card] [Card]     │ │  │                    │ │
│  └────────────────────────────┘ │  │                    │ │
│                                  │  │                    │ │
│  ┌────────────────────────────┐ │  │                    │ │
│  │      Pagination Controls   │ │  │                    │ │
│  │  [Prev] [1] [2] [3] [Next] │ │  │                    │ │
│  └────────────────────────────┘ │  └────────────────────┘ │
│                                  │                          │
└──────────────────────────────────┴──────────────────────────┘
```

## Color Scheme

- Active page: #FF385C (Airbnb red)
- Inactive pages: White background, #ddd border
- Hover state: #f0f0f0 background
- Disabled buttons: 50% opacity
- Results counter: #666 text color

## Interaction Flow

1. User lands on homepage → sees page 1 (properties 1-9)
2. User clicks "Next" or "2" → URL changes to `/?page=2`
3. Server fetches properties 10-18
4. Page re-renders with new properties
5. Map continues to show all properties for context
6. Pagination controls update to reflect current page
