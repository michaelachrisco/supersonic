import { expect } from '../spec_helper'
import BaseModel from '../../core/model/base_model'
import Relation from '../../core/model/relation'

describe('Relation', () => {
  describe('initialize', () => {
    it('should assign all the proper variables', () => {
      var relation = new Relation(BaseModel)
      expect(relation.klass).to.eql(BaseModel)
      expect(relation.klassName).to.eql('BaseModel')
      expect(relation.tableName).to.eql('base_models')
    })
  })

  describe('method chaining', () => {
    it('should allow method chaining', () => {
      var relation = new Relation(BaseModel).where({ id: 1 }).where({ email: "foo@bar.com" })
      var expected = {
        text: "SELECT * FROM base_models WHERE (id = 1) AND (email = 'foo@bar.com')",
        values: []
      }
      expect(relation.toParam()).to.eql(expected)
    })
  })

  describe('#buildWhereExpression', () => {
    it('should build a string expression from an object', () => {
      var relation = new Relation(BaseModel)
      var params = { id: 1, email: 'foo@bar.com' }
      var expected = "id = 1 AND email = 'foo@bar.com'"
      expect(relation.buildWhereExpression(params)).to.eql(expected)
    })

    it('should allow a prebuilt where string', () => {
      var relation = new Relation(BaseModel)
      var params = "id ilike '%foo%'"
      var expected = params
      expect(relation.buildWhereExpression(params)).to.eql(expected)
    })
  })

  //describe('#find', () => {
  //  it('should create an escaped sql string', () => {
  //    var relation = new Relation(BaseModel).find(1)
  //    var expected = {
  //      text: 'SELECT * FROM base_models WHERE (id = 1) LIMIT 1',
  //      values: []
  //    }
  //    expect(relation.toParam()).to.eql(expected)
  //  })
  //})

  describe('#where', () => {
    it('should create an escaped sql string', () => {
      var relation = new Relation(BaseModel).where({ id: 1 })
      var expected = {
        text: 'SELECT * FROM base_models WHERE (id = 1)',
        values: []
      }
      expect(relation.toParam()).to.eql(expected)
    })

    it('should handle multiple parameters', () => {
      var relation = new Relation(BaseModel).where({ id: 1, email: 'foo@bar.com' })
      var expected = {
        text: "SELECT * FROM base_models WHERE (id = 1 AND email = 'foo@bar.com')",
        values: []
      }
      expect(relation.toParam()).to.eql(expected)
    })
  })
})
