// Check if a property is available for the given date range
export const isAvailable = (propertySlug, checkIn, checkOut, existingBookings) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  return !existingBookings.some(booking => {
    if (booking.propertySlug !== propertySlug || booking.status !== 'confirmed') {
      return false;
    }
    
    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);
    
    // Check for date overlap
    // No overlap if: checkOut <= booking.checkIn OR checkIn >= booking.checkOut
    // Has overlap if NOT (no overlap)
    return !(checkOutDate <= bookingCheckIn || checkInDate >= bookingCheckOut);
  });
};

// Calculate number of nights between check-in and check-out
export const calculateNights = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate - checkInDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Calculate total price based on nights and price per night
export const calculateTotalPrice = (nights, pricePerNight) => {
  return nights * pricePerNight;
};
