/**
 * Unit tests for utility functions
 * This test suite validates the behavior of helper functions used throughout the application
 */

const { isMultiple } = require('./utils')

describe('isMultiple', () => {
  // Test case: Verify that the function returns 's' for zero (plural form)
  it('should return "s" when value is 0', () => {
    expect(isMultiple(0)).toBe('s')
  })

  // Test case: Verify that the function returns 's' for values greater than 1 (plural form)
  it('should return "s" when value is greater than 1', () => {
    expect(isMultiple(2)).toBe('s')
    expect(isMultiple(10)).toBe('s')
    expect(isMultiple(100)).toBe('s')
  })

  // Test case: Verify that the function returns empty string for value of 1 (singular form)
  it('should return empty string when value is 1', () => {
    expect(isMultiple(1)).toBe('')
  })

  // Test case: Verify that the function returns empty string for negative numbers (singular form)
  it('should return empty string for negative numbers', () => {
    expect(isMultiple(-1)).toBe('')
    expect(isMultiple(-5)).toBe('')
  })
})
