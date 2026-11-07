import { isAvailable, calculateNights, calculateTotalPrice } from '../../utils/availability'

describe('isAvailable', () => {
  it('returns true when bookings array is empty', () => {
    const result = isAvailable('property-1', '2024-01-10', '2024-01-15', [])
    expect(result).toBe(true)
  })

  it('returns true when dates do not overlap with existing bookings', () => {
    const existingBookings = [
      {
        propertySlug: 'property-1',
        checkIn: '2024-01-01',
        checkOut: '2024-01-05',
        status: 'confirmed',
      },
      {
        propertySlug: 'property-1',
        checkIn: '2024-01-20',
        checkOut: '2024-01-25',
        status: 'confirmed',
      },
    ]
    const result = isAvailable('property-1', '2024-01-10', '2024-01-15', existingBookings)
    expect(result).toBe(true)
  })

  it('returns false when dates overlap with existing booking', () => {
    const existingBookings = [
      {
        propertySlug: 'property-1',
        checkIn: '2024-01-10',
        checkOut: '2024-01-15',
        status: 'confirmed',
      },
    ]
    const result = isAvailable('property-1', '2024-01-12', '2024-01-17', existingBookings)
    expect(result).toBe(false)
  })

  it('returns false when new booking completely contains existing booking', () => {
    const existingBookings = [
      {
        propertySlug: 'property-1',
        checkIn: '2024-01-12',
        checkOut: '2024-01-14',
        status: 'confirmed',
      },
    ]
    const result = isAvailable('property-1', '2024-01-10', '2024-01-20', existingBookings)
    expect(result).toBe(false)
  })

  it('returns true when booking is for a different property', () => {
    const existingBookings = [
      {
        propertySlug: 'property-1',
        checkIn: '2024-01-10',
        checkOut: '2024-01-15',
        status: 'confirmed',
      },
    ]
    const result = isAvailable('property-2', '2024-01-10', '2024-01-15', existingBookings)
    expect(result).toBe(true)
  })

  it('returns true when checkOut equals existing checkIn (no overlap)', () => {
    const existingBookings = [
      {
        propertySlug: 'property-1',
        checkIn: '2024-01-15',
        checkOut: '2024-01-20',
        status: 'confirmed',
      },
    ]
    const result = isAvailable('property-1', '2024-01-10', '2024-01-15', existingBookings)
    expect(result).toBe(true)
  })

  it('returns true when checkIn equals existing checkOut (no overlap)', () => {
    const existingBookings = [
      {
        propertySlug: 'property-1',
        checkIn: '2024-01-10',
        checkOut: '2024-01-15',
        status: 'confirmed',
      },
    ]
    const result = isAvailable('property-1', '2024-01-15', '2024-01-20', existingBookings)
    expect(result).toBe(true)
  })
})

describe('calculateNights', () => {
  it('calculates nights correctly for single day', () => {
    const nights = calculateNights('2024-01-10', '2024-01-11')
    expect(nights).toBe(1)
  })

  it('calculates nights correctly for multiple days', () => {
    const nights = calculateNights('2024-01-10', '2024-01-15')
    expect(nights).toBe(5)
  })

  it('calculates nights correctly for week', () => {
    const nights = calculateNights('2024-01-01', '2024-01-08')
    expect(nights).toBe(7)
  })

  it('returns 0 for same day check-in and check-out', () => {
    const nights = calculateNights('2024-01-10', '2024-01-10')
    expect(nights).toBe(0)
  })
})

describe('calculateTotalPrice', () => {
  it('calculates total price correctly', () => {
    const total = calculateTotalPrice(5, 100)
    expect(total).toBe(500)
  })

  it('handles single night', () => {
    const total = calculateTotalPrice(1, 150)
    expect(total).toBe(150)
  })

  it('handles zero nights', () => {
    const total = calculateTotalPrice(0, 100)
    expect(total).toBe(0)
  })

  it('handles decimal prices', () => {
    const total = calculateTotalPrice(3, 99.99)
    expect(total).toBe(299.97)
  })
})
