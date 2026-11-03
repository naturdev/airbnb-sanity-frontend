import { useState } from "react"

const FilterBar = ({ onFilterChange, filters }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    const defaultFilters = {
      minPrice: 0,
      maxPrice: 1000,
      bedrooms: 0,
      propertyType: "Any",
    }
    setLocalFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Price Range:</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice}
            onChange={(e) =>
              handleFilterChange("minPrice", parseInt(e.target.value) || 0)
            }
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice}
            onChange={(e) =>
              handleFilterChange("maxPrice", parseInt(e.target.value) || 1000)
            }
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Bedrooms:</label>
        <select
          value={localFilters.bedrooms}
          onChange={(e) =>
            handleFilterChange("bedrooms", parseInt(e.target.value))
          }
        >
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Property Type:</label>
        <select
          value={localFilters.propertyType}
          onChange={(e) => handleFilterChange("propertyType", e.target.value)}
        >
          <option value="Any">Any</option>
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Guesthouse">Guesthouse</option>
          <option value="Hotel">Hotel</option>
        </select>
      </div>

      <button className="clear-filters-btn" onClick={handleClearFilters}>
        Clear Filters
      </button>
    </div>
  )
}

export default FilterBar
