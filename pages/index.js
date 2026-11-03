import { useState } from "react"
import Image from "next/image"
import { sanityClient, urlFor } from "../sanity"
import Link from "next/link"
import { isMultiple } from "../utils"
import DashboardMap from "../components/DashboardMap"
import FilterBar from "../components/FilterBar"

const Home = ({ properties }) => {
  console.log(properties)
  
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    bedrooms: 0,
    propertyType: "Any",
  })

  const filterProperties = (properties) => {
    return properties.filter((property) => {
      // Filter by price range
      const priceMatch =
        property.pricePerNight >= filters.minPrice &&
        property.pricePerNight <= filters.maxPrice

      // Filter by bedrooms
      const bedroomsMatch =
        filters.bedrooms === 0 || property.bedrooms >= filters.bedrooms

      // Filter by property type
      const typeMatch =
        filters.propertyType === "Any" ||
        property.propertyType === filters.propertyType

      return priceMatch && bedroomsMatch && typeMatch
    })
  }

  const filteredProperties = filterProperties(properties)

  return (
    <>
      {properties && (
        <div className="main">
          <div className="feed-container">
            <h1>Places to stay near you</h1>
            <FilterBar onFilterChange={setFilters} filters={filters} />
            <div className="feed">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <Link href={`property/${property.slug.current}`} key={property._id}>
                    <div className="card">
                      <div className="card-image">
                        <Image
                          src={urlFor(property.mainImage).url()}
                          alt={property.title}
                          width={250}
                          height={200}
                          objectFit="cover"
                        />
                      </div>
                      <p>
                        {property.reviews.length} review
                        {isMultiple(property.reviews.length)}
                      </p>
                      <h3>{property.title}</h3>
                      <h3>
                        <b>£{property.pricePerNight}/per Night</b>
                      </h3>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="no-results">
                  No properties match your filters. Try adjusting your search criteria.
                </p>
              )}
            </div>
          </div>
          <div className="map">
            <DashboardMap properties={filteredProperties} />
          </div>
        </div>
      )}
    </>
  )
}

export const getServerSideProps = async () => {
  const query = '*[ _type == "property"]{_id, title, slug, mainImage, pricePerNight, beds, bedrooms, propertyType, reviews}'
  const properties = await sanityClient.fetch(query)

  if (!properties.length) {
    return {
      props: {
        properties: [],
      },
    }
  } else {
    return {
      props: {
        properties,
      },
    }
  }
}

export default Home
