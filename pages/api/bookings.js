import fs from 'fs';
import path from 'path';
import { isAvailable, calculateNights, calculateTotalPrice } from '../../utils/availability';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { propertySlug, guestName, guestEmail, checkIn, checkOut, pricePerNight } = req.body;

  // Validate required fields
  if (!propertySlug || !guestName || !guestEmail || !checkIn || !checkOut || !pricePerNight) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return res.status(400).json({ error: 'Check-in date cannot be in the past' });
  }

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({ error: 'Check-out date must be after check-in date' });
  }

  // Read existing bookings
  const bookingsPath = path.join(process.cwd(), 'data', 'bookings.json');
  let bookingsData;
  
  try {
    const fileContent = fs.readFileSync(bookingsPath, 'utf8');
    bookingsData = JSON.parse(fileContent);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to read bookings data' });
  }

  // Check availability
  if (!isAvailable(propertySlug, checkIn, checkOut, bookingsData.bookings)) {
    return res.status(409).json({ error: 'Property is not available for the selected dates' });
  }

  // Calculate total price
  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = calculateTotalPrice(nights, pricePerNight);

  // Generate booking ID
  const bookingId = `booking-${Date.now()}`;

  // Create booking object
  const newBooking = {
    id: bookingId,
    propertySlug,
    guestName,
    guestEmail,
    checkIn,
    checkOut,
    totalPrice,
    status: 'confirmed'
  };

  // Add to bookings array
  bookingsData.bookings.push(newBooking);

  // Write back to file
  try {
    fs.writeFileSync(bookingsPath, JSON.stringify(bookingsData, null, 2));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save booking' });
  }

  // Return success
  return res.status(200).json(newBooking);
}
