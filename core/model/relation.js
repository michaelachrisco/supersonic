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
    if (typeof params === 'string') {
      return params
    } else {
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
  }

  all() {
    return new Relation(
      this.klass,
      this.baseSelect()
    ).execute()
  }

  limit(count = 10) {
    return new Relation(
      this.klass,
      this.baseSelect().limit(count)
    )
  }

  first() {
    return new Relation(
      this.klass,
      this.baseSelect().limit(1)
    ).execute().then(rows => rows ? rows[0] : null )
  }

  find(id) {
    return new Relation(
      this.klass,
      this.baseSelect().where(`id = '${id}'`).limit(1)
    ).execute().then(rows => rows ? rows[0] : null )
  }

  where(params) {
    return new Relation(
      this.klass,
      this.baseSelect().where(this.buildWhereExpression(params))
    )
  }

  order(params) {
    let key = Object.keys(params)[0],
        ordering = params[key].toUpperCase() === 'ASC'

    return new Relation(
      this.klass,
      this.baseSelect().order(key, ordering)
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
