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
        email: "string"
      })
      var expected = heredoc`
      CREATE TABLE users (
        email character varying(255),
        created_at timestamp DEFAULT current_timestamp,
        updated_at timestamp DEFAULT current_timestamp,
        id UUID PRIMARY KEY DEFAULT gen_random_uuid()
      );
      `

      expect(sql.replace(/^\s+/gm, '')).to.eql(expected)
    })
  })
})
