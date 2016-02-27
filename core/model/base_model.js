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

  static relation(name) {
    return new Relation(eval(name))
  }

  static first() {
    return BaseModel.relation(this.name).first()
  }

  static find(id) {
    return BaseModel.relation(this.name).find(id)
  };

  static where(params) {
    return BaseModel.relation(this.name).where(params)
  };

  constructor(attributes) {
    for (let key in attributes) {
      this[key] = attributes[key]
    }
  }
}
