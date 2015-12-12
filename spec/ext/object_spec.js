import { expect } from '../spec_helper'

describe('is_a', () => {
  it('should return true if the object is what you say it is', () => {
    var f = function() { return 1 }
    expect(f.is_a('Function')).to.be.true
  })

  it('should return false if the object is not what you say it is', () => {
    var f = 'foo'
    expect(f.is_a('Function')).to.be.false
  })

  it('should handle strings', () => {
    var f = 'foo'
    expect(f.is_a('String')).to.be.true
  })

  it('should handle numbers', () => {
    var f = 1
    expect(f.is_a('Number')).to.be.true
  })
})
