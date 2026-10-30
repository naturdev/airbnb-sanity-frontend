import { sanityClient } from "../../sanity"
import Head from "next/head"
import { isMultiple } from "../../utils"
import Image from "../../components/Image"
import Review from "../../components/Review"
import Map from "../../components/Map"
import Link from "next/link"

const Property = ({
  title,
  location,
  propertyType,
  mainImage,
  images,
  pricePerNight,
  beds,
  bedrooms,
  description,
  host,
  reviews,
}) => {
  const reviewAmount = reviews.length

  return (
    <div className="container">
      <Head>
        <title>{title} - Airbnb Clone</title>
        <meta name="description" content={`${title} - £${pricePerNight} per night. ${bedrooms} bedroom${isMultiple(bedrooms)}, ${beds} bed${isMultiple(beds)}. ${reviewAmount} review${isMultiple(reviewAmount)}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="property" />
      </Head>
      <h1>
        <b>{title}</b>
      </h1>
      <p>
        {reviewAmount} review{isMultiple(reviewAmount)}
      </p>
      <div className="images-section">
        <Image identifier="main-image" image={mainImage} alt={title} />
        <div className="sub-images-section">
          {images.map(({ _key, asset }, image) => (
            <Image key={_key} identifier="image" image={asset} alt={`${title} - additional image`} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="information">
          <h2>
            <b>
              {propertyType} hosted by {host?.name}
            </b>
          </h2>
          <h4>
            {bedrooms} bedroom{isMultiple(bedrooms)} * {beds} bed
            {isMultiple(beds)}
          </h4>
          <hr />
          <h4>
            <b>Enhanced Clean</b>
          </h4>
          <p>
            This host is committed to Airbnb's 5-step enhanced cleaning process.
          </p>
          <h4>
            <b>Amenities for everyday living</b>
          </h4>
          <p>
            The host has equipped this place for long stays - kitchen, shampoo,
            conditioner, hairdryer included.
          </p>
          <h4>
            <b>House rules</b>
          </h4>
          <p>
            This place isn't suitable for pets andthe host does not allow
            parties or smoking.
          </p>
        </div>
        <div className="price-box">
          <h2>£{pricePerNight}</h2>
          <h4>
            {reviewAmount} review{isMultiple(reviewAmount)}
          </h4>
          <Link href="/">
            <div className="button">Change Dates</div>
          </Link>
        </div>
      </div>

      <hr />

      <h4>{description}</h4>

      <hr />

      <h2>
        {reviewAmount} review{isMultiple(reviewAmount)}
      </h2>
      {reviewAmount > 0 &&
        reviews.map((review) => <Review key={review._key} review={review} />)}

      <hr />

      <h2>Location</h2>
      <Map location={location}></Map>
    </div>
  )
}

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug

  const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
    title,
    location,
    propertyType,
    mainImage,
    images,
    pricePerNight,
    beds,
    bedrooms,
    description,
    host->{
      _id,
      name,
      slug,
      image
    },
    reviews[]{
      ...,
      traveller->{
        _id,
        name,
        slug,
        image
      }
    }
  }`

  try {
    const property = await sanityClient.fetch(query, { pageSlug })

    if (!property) {
      return {
        props: null,
        notFound: true,
      }
    }

    return {
      props: {
        title: property.title,
        location: property.location,
        propertyType: property.propertyType,
        mainImage: property.mainImage,
        images: property.images,
        pricePerNight: property.pricePerNight,
        beds: property.beds,
        bedrooms: property.bedrooms,
        description: property.description,
        host: property.host,
        reviews: property.reviews,
      },
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    return {
      props: null,
      notFound: true,
    }
  }
}

export default Property
