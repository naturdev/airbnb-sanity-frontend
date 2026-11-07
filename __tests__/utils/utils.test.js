import { isMultiple } from '../../utils'

describe('isMultiple', () => {
  it('returns "s" for 0', () => {
    expect(isMultiple(0)).toBe('s')
  })

  it('returns empty string for 1', () => {
    expect(isMultiple(1)).toBe('')
  })

  it('returns "s" for 2', () => {
    expect(isMultiple(2)).toBe('s')
  })

  it('returns "s" for numbers greater than 2', () => {
    expect(isMultiple(5)).toBe('s')
    expect(isMultiple(100)).toBe('s')
  })
})
