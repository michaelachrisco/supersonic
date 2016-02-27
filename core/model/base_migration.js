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
  };

  createTable(structure) {
    var sql = `CREATE TABLE ${structure.tableName} (`
    for (let key of Object.keys(structure)) {
      if (key !== 'tableName') {
        sql = sql + `\n  ${key} ${BaseMigration.typeMap[structure[key]].pgType},`
      }
    }
    sql = sql + `\n  created_at timestamp DEFAULT current_timestamp,`
    sql = sql + `\n  updated_at timestamp DEFAULT current_timestamp,`
    return sql + `\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid()\n);`
  }
}
