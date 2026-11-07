import fs from 'fs'
import path from 'path'
import Link from 'next/link'

const BookingConfirmation = ({ booking }) => {
  return (
    <div className="form-container">
      <div className="confirmation-box">
        <h1>Booking Confirmed!</h1>
        <p className="confirmation-number">Confirmation Number: {booking.id}</p>
        
        <div className="booking-details">
          <h2>Booking Details</h2>
          <p><strong>Guest Name:</strong> {booking.guestName}</p>
          <p><strong>Email:</strong> {booking.guestEmail}</p>
          <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
          <p className="total-price"><strong>Total Price:</strong> ${booking.totalPrice}</p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <Link href="/">
            <a className="button">Back to Home</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (pageContext) => {
  const bookingId = pageContext.query.id

  // Read bookings from file
  const bookingsPath = path.join(process.cwd(), 'data', 'bookings.json')
  
  try {
    const fileContent = fs.readFileSync(bookingsPath, 'utf8')
    const bookingsData = JSON.parse(fileContent)
    
    // Find booking by ID
    const booking = bookingsData.bookings.find(b => b.id === bookingId)
    
    if (!booking) {
      return {
        props: null,
        notFound: true,
      }
    }

    return {
      props: {
        booking,
      },
    }
  } catch (error) {
    return {
      props: null,
      notFound: true,
    }
  }
}

export default BookingConfirmation
