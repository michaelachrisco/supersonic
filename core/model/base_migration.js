import {
  Str,
  Text,
  Bool,
  Float,
  Integer,
  DateTime
} from './types'

export default class BaseMigration {
  static typeMap = {
    string: Str,
    text: Text,
    boolean: Bool,
    float: Float,
    integer: Integer,
    datetime: DateTime
  }

  createTable(structure) {
    var sql = `CREATE TABLE ${structure.tableName} (`
    structure.each((key, value) => {
      if (key !== 'tableName') {
        sql = sql + `\n  ${key} ${BaseMigration.typeMap[value].pgType},`
      }
    })
    sql = sql + `\n  created_at timestamp DEFAULT current_timestamp,`
    sql = sql + `\n  updated_at timestamp DEFAULT current_timestamp,`
    return sql + `\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid()\n);`
  }
}
