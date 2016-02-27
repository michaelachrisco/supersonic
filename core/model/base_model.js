import 'legit-inflectors'
import squel from 'squel'

import Relation from './relation'

export default class BaseModel {
  static create(params) {
    let pg = squel.useFlavour('postgres')
    let tableName = this.name.underscore().pluralize

    return pg.
      insert().
      into(tableName).
      setFields(params).
      returning('*').
      toParam()
  };

  static first() {
    return new Relation(eval(this.name)).first()
  }

  static find(id) {
    return new Relation(eval(this.name)).find(id)
  };

  static where(params) {
    return new Relation(eval(this.name)).where(params)
  };

  constructor(attributes) {
    for (let key in attributes) {
      this[key] = attributes[key]
    }
  }
}
