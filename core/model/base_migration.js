import {
  Str,
  Text,
  Bool,
  Float,
  Integer,
  DateTime
} from './types'

export default class BaseMigration {
  static Str = Str;
  static Text = Text;
  static Bool = Bool;
  static Float = Float;
  static Integer = Integer;
  static DateTime = DateTime;

  createTable(structure) {
    var sql = `CREATE TABLE ${structure.tableName} (`
    structure.each((key, value) => {
      if (key !== 'tableName') {
        sql = sql + `\n  ${key} ${BaseMigration[value].pgType},`
      }
    })
    sql = sql + `\n  created_at timestamp DEFAULT current_timestamp,`
    sql = sql + `\n  updated_at timestamp DEFAULT current_timestamp,`
    return sql + `\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid()\n);`
  }
}
