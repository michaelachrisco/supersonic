import fs from 'fs'
import squel from 'squel'
import DatabaseAdapter from './database_adapter'

export default class Relation {
  constructor(klass, relation = null) {
    this.klass = klass
    this.klassName = klass.name
    this.tableName = klass.name.underscore().pluralize
    this.pg = squel.useFlavour('postgres')
    this.relation = relation || squel.useFlavour('postgres')
    if (!(process.env.NODE_ENV === 'test')) {
      var dbConfig = JSON.parse(fs.readFileSync(process.cwd() + '/config/db.json').toString())[process.env.NODE_ENV || 'development']
      this.adapter = new DatabaseAdapter(dbConfig)
    }
  }

  get results() {
    return this._results
  }

  set results(items) {
    this._results = items
  }

  baseSelect() {
    if (this.relation.constructor.name === 'Select') {
      return this.relation
    } else {
      return this.relation.select().from(this.tableName)
    }
  }

  buildWhereExpression(params) {
    let expressions = []

    for (let key in params) {
      if (typeof params[key] === 'string') {
        expressions.push(`${key} = '${params[key]}'`)
      } else {
        expressions.push(`${key} = ${params[key]}`)
      }
    }

    let expr = squel.expr().and(expressions[0])

    for (var i = 1; i < expressions.length; i++) {
      expr = expr.and(expressions[i])
    }

    return expr.toString()
  }

  first() {
    return new Relation(
      this.klass,
      this.baseSelect().limit(1)
    ).execute()
  }

  find(id) {
    return new Relation(
      this.klass,
      this.baseSelect().where(`id = '${id}'`).limit(1)
    ).execute()
  }

  where(params) {
    return new Relation(
      this.klass,
      this.baseSelect().where(this.buildWhereExpression(params))
    )
  }

  toParam() {
    return this.relation.toParam()
  }

  async execute() {
    try {
      let results = await this.adapter.runQuery(this.toParam())
      this.results = results.map(row => new this.klass(row))
    }
    catch (err) {
      console.error(err)
    }
    finally {
      return this.results
    }
  }
}
