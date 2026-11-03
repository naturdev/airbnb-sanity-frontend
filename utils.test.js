const { isMultiple } = require('./utils');

describe('isMultiple', () => {
  // This test verifies that the isMultiple function correctly returns 's' for plural values
  // and an empty string for singular values, which is useful for dynamically pluralizing text
  it('should return "s" when value is 0', () => {
    expect(isMultiple(0)).toBe('s');
  });

  it('should return "s" when value is greater than 1', () => {
    expect(isMultiple(2)).toBe('s');
    expect(isMultiple(10)).toBe('s');
    expect(isMultiple(100)).toBe('s');
  });

  it('should return empty string when value is 1', () => {
    expect(isMultiple(1)).toBe('');
  });

  // Edge case: negative numbers should be treated as singular since they're not > 1
  it('should return empty string for negative numbers', () => {
    expect(isMultiple(-1)).toBe('');
    expect(isMultiple(-5)).toBe('');
  });
});
