# Memory Leaks Analysis

## Issues Found

### 1. **Missing Key Props in DashboardMap.js (Critical)**
**Location:** `components/DashboardMap.js`, line 45-56
**Issue:** Markers rendered in a map don't have key props
```javascript
{properties.map((property, index) => (
  <Marker
    position={{...}}
    icon={{...}}
  />  // ❌ Missing key prop
))}
```
**Impact:** React cannot properly reconcile list items, causing memory leaks when properties change
**Fix:** Add `key={property._id}` to the Marker component

---

### 2. **Missing Dependency Arrays in useCallback (High)**
**Location:** `components/DashboardMap.js` and `components/Map.js`
**Issue:** useCallback hooks don't specify dependency arrays
```javascript
const onLoad = React.useCallback(function callback(map) {
  const bounds = new window.google.maps.LatLngBounds()
  map.fitBounds(bounds)
  setMap(map)
}, [])  // ❌ Empty dependency array - callback never updates

const onUnmount = React.useCallback(function callback(map) {
  setMap(null)
}, [])
```
**Impact:** Callbacks may reference stale state/props, and cleanup may not work properly
**Fix:** Add proper dependencies: `[properties]` for DashboardMap, `[location]` for Map

---

### 3. **Potential Google Maps API Memory Leak (High)**
**Location:** `components/DashboardMap.js` and `components/Map.js`
**Issue:** The `useJsApiLoader` hook is called on every render without proper cleanup
```javascript
const { isLoaded } = useJsApiLoader({
  id: "google-map-script",
  googleMapsApiKey: process.env.googlePlacesAPI,
})
```
**Impact:** Multiple script loads and event listeners can accumulate
**Fix:** Ensure the hook is only called once per component lifecycle

---

### 4. **Duplicate console.log Statements (Minor)**
**Location:** 
- `components/DashboardMap.js`, lines 10-11
- `components/Map.js`, lines 10-11, 17
**Issue:** Duplicate logging statements
**Impact:** Unnecessary memory usage and performance degradation
**Fix:** Remove duplicate console.log statements

---

### 5. **Missing Alt Attributes on Images (Accessibility)**
**Location:** 
- `pages/index.js`, line 18
- `components/Image.js`, line 6
- `components/Review.js`, line 9
**Issue:** Images don't have alt attributes
**Impact:** Accessibility issue and potential memory concerns with image loading
**Fix:** Add descriptive alt attributes

---

## Summary of Fixes

| Issue | Severity | File | Fix |
|-------|----------|------|-----|
| Missing key props | Critical | DashboardMap.js | Add `key={property._id}` |
| Missing dependencies | High | DashboardMap.js, Map.js | Add proper dependency arrays |
| Duplicate logs | Minor | DashboardMap.js, Map.js | Remove duplicates |
| Missing alt attributes | Medium | Multiple | Add alt text |

