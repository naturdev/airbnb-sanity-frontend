import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import sanityClient from '../../../sanity'
import { calculateNights, calculateTotalPrice } from '../../../utils/availability'

const BookProperty = ({ title, pricePerNight, slug }) => {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Calculate nights and total price
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0
  const totalPrice = nights > 0 ? calculateTotalPrice(nights, pricePerNight) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertySlug: slug,
          guestName,
          guestEmail,
          checkIn,
          checkOut,
          pricePerNight,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create booking')
        setLoading(false)
        return
      }

      // Redirect to confirmation page
      router.push(`/booking/${data.id}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>Book {title}</h1>
      <p className="price">${pricePerNight} per night</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="checkIn">Check-in Date</label>
          <input
            type="date"
            id="checkIn"
            className="input"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkOut">Check-out Date</label>
          <input
            type="date"
            id="checkOut"
            className="input"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>

        {nights > 0 && (
          <div className="booking-summary">
            <p>{nights} night{nights !== 1 ? 's' : ''}</p>
            <p className="total">Total: ${totalPrice}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="guestName">Full Name</label>
          <input
            type="text"
            id="guestName"
            className="input"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="guestEmail">Email</label>
          <input
            type="email"
            id="guestEmail"
            className="input"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <Link href={`/property/${slug}`}>
          <a>← Back to property</a>
        </Link>
      </div>
    </div>
  )
}

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug

  const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
    title,
    pricePerNight,
    slug
  }`

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
      pricePerNight: property.pricePerNight,
      slug: property.slug.current,
    },
  }
}

export default BookProperty
