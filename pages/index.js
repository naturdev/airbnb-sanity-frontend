import { sanityClient, urlFor } from "../sanity"
import Link from "next/link"
import { isMultiple } from "../utils"
import DashboardMap from "../components/DashboardMap"

const Home = ({ properties, error }) => {
  if (error) {
    return (
      <div className="container">
        <h1>Oops! Something went wrong</h1>
        <p>We couldn't load the properties. Please try again later.</p>
      </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="container">
        <h1>No properties available</h1>
        <p>Check back soon for new listings!</p>
      </div>
    )
  }

  return (
    <>
      <div className="main">
        <div className="feed-container">
          <h1>Places to stay near you</h1>
          <div className="feed">
            {properties.map((property) => (
              <Link key={property._id} href={`property/${property.slug.current}`}>
                <div className="card">
                  <img src={urlFor(property.mainImage)} alt={property.title} />
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
            ))}
          </div>
        </div>
        <div className="map">
          <DashboardMap properties={properties} />
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async () => {
  try {
    const query = '*[ _type == "property"]'
    const properties = await sanityClient.fetch(query)

    return {
      props: {
        properties: properties || [],
      },
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
    return {
      props: {
        properties: [],
        error: 'Failed to fetch properties',
      },
    }
  }
}

export default Home
