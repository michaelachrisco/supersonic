import { expect } from '../spec_helper'
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

  describe('.first', () => {
    it('should delegate to the relation and create the proper sql', () => {
      var relation = BaseModel.first()
      var expected = {
        text: 'SELECT * FROM base_models LIMIT 1',
        values: []
      }
      expect(relation.toParam()).to.eql(expected)
    })
  })

  describe('.find', () => {
    it('should delegate to the relation and create the proper sql', () => {
      var relation = BaseModel.find(1)
      var expected = {
        text: 'SELECT * FROM base_models WHERE (id = 1) LIMIT 1',
        values: []
      }
      expect(relation.toParam()).to.eql(expected)
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
