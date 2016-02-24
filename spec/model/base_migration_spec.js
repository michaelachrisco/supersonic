import { expect } from '../spec_helper'
import BaseMigration from '../../core/model/base_migration'
import { Str } from '../../core/model/types'
import { heredoc } from '../../core/utils/strings'

describe('BaseMigration', () => {
  describe('#createTable', () => {
    it('should output the SQL to generate a table', () => {
      var m = new BaseMigration()
      var sql = m.createTable({
        tableName: 'users',
        email: Str
      })
      var expected = heredoc`
      CREATE TABLE users (
      email character varying(255),
      id integer NOT NULL
      );
      `

      expect(sql).to.eql(expected)
    })
  })
})
