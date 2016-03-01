import { Map } from 'immutable'
import {
  Str,
  Text,
  Bool,
  Float,
  Integer,
  DateTime,
  Id
} from './types'

export default class BaseMigration {
  static typeMap = Map({
    string: Str,
    text: Text,
    boolean: Bool,
    float: Float,
    integer: Integer,
    datetime: DateTime,
    id: Id
  });

  createTable(structure) {
    var sql = `CREATE TABLE ${structure.tableName} (`
    for (let key of Object.keys(structure)) {
      if (key !== 'tableName') {
        var type = BaseMigration.typeMap.get(structure[key], Str).pgType
        sql = sql + `\n  ${key} ${type},`
      }
    }
    sql = sql + `\n  created_at timestamp DEFAULT current_timestamp,`
    sql = sql + `\n  updated_at timestamp DEFAULT current_timestamp,`
    return sql + `\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid()\n);`
  }
}
