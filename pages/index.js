import { sanityClient, urlFor } from "../sanity"
import Link from "next/link"
import { isMultiple } from "../utils"
import DashboardMap from "../components/DashboardMap"
import Pagination from "../components/Pagination"

const PROPERTIES_PER_PAGE = 9

const Home = ({ properties, allProperties, currentPage, totalPages, totalCount }) => {
  console.log(properties)
  return (
    <>
      {properties && (
        <div className="main">
          <div className="feed-container">
            <h1>Places to stay near you</h1>
            <p className="results-counter">
              Showing {(currentPage - 1) * PROPERTIES_PER_PAGE + 1}-{Math.min(currentPage * PROPERTIES_PER_PAGE, totalCount)} of {totalCount} properties
            </p>
            <div className="feed">
              {properties.map((property) => (
                <Link key={property._id} href={`property/${property.slug.current}`}>
                  <div className="card">
                    <img src={urlFor(property.mainImage)} />
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
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
          <div className="map">
            <DashboardMap properties={allProperties} />
          </div>
        </div>
      )}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const page = parseInt(context.query.page) || 1
  const start = (page - 1) * PROPERTIES_PER_PAGE
  const end = start + PROPERTIES_PER_PAGE

  const query = `*[ _type == "property"] | order(_createdAt desc) [${start}...${end}]`
  const properties = await sanityClient.fetch(query)

  const countQuery = 'count(*[ _type == "property"])'
  const totalCount = await sanityClient.fetch(countQuery)
  const totalPages = Math.ceil(totalCount / PROPERTIES_PER_PAGE)

  const mapQuery = '*[ _type == "property"]{ _id, location, title, pricePerNight }'
  const allProperties = await sanityClient.fetch(mapQuery)

  if (!properties.length) {
    return {
      props: {
        properties: [],
        allProperties: [],
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      },
    }
  } else {
    return {
      props: {
        properties,
        allProperties,
        currentPage: page,
        totalPages,
        totalCount,
      },
    }
  }
}

export default Home
