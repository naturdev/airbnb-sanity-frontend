import fs from 'fs'
import path from 'path'
import bookingsHandler from '../../pages/api/bookings'

// Mock fs module
jest.mock('fs')

describe('/api/bookings', () => {
  let req, res

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Mock request and response objects
    req = {
      method: 'POST',
      body: {},
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    // Mock fs.readFileSync to return empty bookings
    fs.readFileSync.mockReturnValue(JSON.stringify({ bookings: [] }))
    fs.writeFileSync.mockImplementation(() => {})
  })

  describe('POST /api/bookings', () => {
    it('creates a booking with valid data', () => {
      req.body = {
        propertySlug: 'property-1',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        checkIn: '2024-06-01',
        checkOut: '2024-06-05',
        pricePerNight: 100,
      }

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^booking-\d+$/),
          propertySlug: 'property-1',
          guestName: 'John Doe',
          guestEmail: 'john@example.com',
          checkIn: '2024-06-01',
          checkOut: '2024-06-05',
          totalPrice: 400,
          status: 'confirmed',
        })
      )
      expect(fs.writeFileSync).toHaveBeenCalled()
    })

    it('returns 400 when guestName is missing', () => {
      req.body = {
        propertySlug: 'property-1',
        guestEmail: 'john@example.com',
        checkIn: '2024-06-01',
        checkOut: '2024-06-05',
        pricePerNight: 100,
      }

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('required'),
        })
      )
    })

    it('returns 400 when guestEmail is missing', () => {
      req.body = {
        propertySlug: 'property-1',
        guestName: 'John Doe',
        checkIn: '2024-06-01',
        checkOut: '2024-06-05',
        pricePerNight: 100,
      }

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('required'),
        })
      )
    })

    it('returns 400 when checkOut is before checkIn', () => {
      req.body = {
        propertySlug: 'property-1',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        checkIn: '2024-06-05',
        checkOut: '2024-06-01',
        pricePerNight: 100,
      }

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Check-out date must be after check-in date'),
        })
      )
    })

    it('returns 400 when checkIn is in the past', () => {
      req.body = {
        propertySlug: 'property-1',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        checkIn: '2020-01-01',
        checkOut: '2020-01-05',
        pricePerNight: 100,
      }

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('past'),
        })
      )
    })

    it('returns 409 when dates overlap with existing booking', () => {
      // Mock existing bookings
      fs.readFileSync.mockReturnValue(
        JSON.stringify({
          bookings: [
            {
              id: 'booking-123',
              propertySlug: 'property-1',
              checkIn: '2024-06-01',
              checkOut: '2024-06-05',
              status: 'confirmed',
            },
          ],
        })
      )

      req.body = {
        propertySlug: 'property-1',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        checkIn: '2024-06-03',
        checkOut: '2024-06-07',
        pricePerNight: 100,
      }

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('not available'),
        })
      )
    })
  })

  describe('GET /api/bookings', () => {
    it('returns 405 for GET requests', () => {
      req.method = 'GET'

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Method not allowed',
        })
      )
    })
  })

  describe('PUT /api/bookings', () => {
    it('returns 405 for PUT requests', () => {
      req.method = 'PUT'

      bookingsHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Method not allowed',
        })
      )
    })
  })
})
