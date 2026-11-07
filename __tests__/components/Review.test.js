import { render, screen } from '@testing-library/react'
import Review from '../../components/Review'

// Mock the sanity module
jest.mock('../../sanity', () => ({
  urlFor: jest.fn((image) => ({
    width: jest.fn().mockReturnThis(),
    height: jest.fn().mockReturnThis(),
    crop: jest.fn().mockReturnThis(),
    auto: jest.fn().mockReturnValue('https://example.com/image.jpg'),
  })),
}))

describe('Review', () => {
  const mockReview = {
    rating: 5,
    traveller: {
      name: 'John Doe',
      image: 'mock-image-ref',
    },
  }

  it('renders without crashing', () => {
    render(<Review review={mockReview} />)
    const reviewBox = screen.getByText('5').closest('.review-box')
    expect(reviewBox).toBeInTheDocument()
  })

  it('displays the rating', () => {
    render(<Review review={mockReview} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('displays the traveller name', () => {
    render(<Review review={mockReview} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders the traveller image', () => {
    const { container } = render(<Review review={mockReview} />)
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('has correct CSS class', () => {
    const { container } = render(<Review review={mockReview} />)
    const reviewBox = container.querySelector('.review-box')
    expect(reviewBox).toBeInTheDocument()
  })

  it('renders with different rating values', () => {
    const reviewWithDifferentRating = {
      ...mockReview,
      rating: 4.5,
    }
    render(<Review review={reviewWithDifferentRating} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })
})
