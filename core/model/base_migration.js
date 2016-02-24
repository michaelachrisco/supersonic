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

    return sql + `\n  id integer NOT NULL\n);`
  }
}
