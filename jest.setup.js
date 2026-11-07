import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'
process.env.googlePlacesAPI = 'test-api-key'

// Mock next-sanity
jest.mock('next-sanity', () => ({
  createClient: jest.fn(() => ({
    fetch: jest.fn(),
  })),
  createImageUrlBuilder: jest.fn(() => jest.fn()),
  createPortableTextComponent: jest.fn(),
  createPreviewSubscriptionHook: jest.fn(),
  createCurrentUserHook: jest.fn(),
}))

// Mock @react-google-maps/api
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  Marker: () => <div data-testid="marker" />,
  useLoadScript: () => ({ isLoaded: true }),
}))
