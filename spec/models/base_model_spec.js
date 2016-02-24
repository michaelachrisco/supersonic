import { expect } from '../spec_helper'
import BaseModel from '../../core/model/base_model'

describe('BaseModel', () => {
  describe('initialize', () => {
    it('should assign all the passed in attributes', () => {
      var model = new BaseModel({ a: 1, b: 2 })
      expect(model.a).to.eql(1)
      expect(model.b).to.eql(2)
    })
  })
})
