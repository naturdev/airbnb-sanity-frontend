/**
 * Check if a property is available for the given date range
 * @param {string} propertySlug - The property identifier
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @param {Array} existingBookings - Array of existing bookings
 * @returns {boolean} - True if available, false if there's a conflict
 */
export const isAvailable = (propertySlug, checkIn, checkOut, existingBookings) => {
  const newCheckIn = new Date(checkIn)
  const newCheckOut = new Date(checkOut)

  // Check for overlaps with confirmed bookings for this property
  for (const booking of existingBookings) {
    if (booking.propertySlug !== propertySlug || booking.status !== 'confirmed') {
      continue
    }

    const existingCheckIn = new Date(booking.checkIn)
    const existingCheckOut = new Date(booking.checkOut)

    // Check if dates overlap
    // Overlap occurs if: !(newCheckOut <= existingCheckIn || newCheckIn >= existingCheckOut)
    const hasOverlap = !(newCheckOut <= existingCheckIn || newCheckIn >= existingCheckOut)

    if (hasOverlap) {
      return false
    }
  }

  return true
}

/**
 * Calculate the number of nights between two dates
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {number} - Number of nights
 */
export const calculateNights = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const diffTime = checkOutDate - checkInDate
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Calculate the total price for a booking
 * @param {number} nights - Number of nights
 * @param {number} pricePerNight - Price per night
 * @returns {number} - Total price
 */
export const calculateTotalPrice = (nights, pricePerNight) => {
  return nights * pricePerNight
}
