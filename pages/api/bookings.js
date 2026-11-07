import fs from 'fs'
import path from 'path'
import { isAvailable, calculateNights, calculateTotalPrice } from '../../utils/availability'

const bookingsFilePath = path.join(process.cwd(), 'data', 'bookings.json')

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { propertySlug, guestName, guestEmail, checkIn, checkOut, pricePerNight } = req.body

  // Validate required fields
  if (!propertySlug || !guestName || !guestEmail || !checkIn || !checkOut || !pricePerNight) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  // Validate dates
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (checkInDate < today) {
    return res.status(400).json({ error: 'Check-in date cannot be in the past' })
  }

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({ error: 'Check-out date must be after check-in date' })
  }

  // Read existing bookings
  let bookingsData = { bookings: [] }
  try {
    if (fs.existsSync(bookingsFilePath)) {
      const fileContent = fs.readFileSync(bookingsFilePath, 'utf8')
      bookingsData = JSON.parse(fileContent)
    }
  } catch (error) {
    console.error('Error reading bookings file:', error)
  }

  // Check availability
  if (!isAvailable(propertySlug, checkIn, checkOut, bookingsData.bookings)) {
    return res.status(409).json({ error: 'Property is not available for the selected dates' })
  }

  // Calculate total price
  const nights = calculateNights(checkIn, checkOut)
  const totalPrice = calculateTotalPrice(nights, pricePerNight)

  // Create new booking
  const newBooking = {
    id: `booking-${Date.now()}`,
    propertySlug,
    guestName,
    guestEmail,
    checkIn,
    checkOut,
    nights,
    pricePerNight,
    totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  // Add to bookings array
  bookingsData.bookings.push(newBooking)

  // Write back to file
  try {
    const dir = path.dirname(bookingsFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookingsData, null, 2))
  } catch (error) {
    console.error('Error writing bookings file:', error)
    return res.status(500).json({ error: 'Failed to save booking' })
  }

  return res.status(200).json(newBooking)
}
