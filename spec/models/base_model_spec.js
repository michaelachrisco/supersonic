import { expect, sinon } from '../spec_helper'
import BaseModel from '../../core/model/base_model'

describe('BaseModel', () => {
  describe('.create', () => {
    it('should create an escaped sql string', () => {
      var sqlTemplate = BaseModel.create({foo: 'bar', baz: 'baloney'})
      var expected = {
        text: 'INSERT INTO base_models (foo, baz) VALUES ($1, $2) RETURNING *',
        values: [ 'bar', 'baloney' ],
      }
      expect(sqlTemplate).to.eql(expected)
    })
  })

  describe('initialize', () => {
    it('should assign all the passed in attributes', () => {
      var model = new BaseModel({ a: 1, b: 2 })
      expect(model.a).to.eql(1)
      expect(model.b).to.eql(2)
    })
  })
})
