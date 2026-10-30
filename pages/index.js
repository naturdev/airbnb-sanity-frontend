import { sanityClient, urlFor } from "../sanity"
import Link from "next/link"
import Head from "next/head"
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
      <Head>
        <title>Airbnb Clone - Find Your Perfect Stay</title>
        <meta name="description" content="Discover unique places to stay around the world. Browse properties, read reviews, and book your next adventure." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Airbnb Clone - Find Your Perfect Stay" />
        <meta property="og:description" content="Discover unique places to stay around the world." />
        <meta property="og:type" content="website" />
      </Head>
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
