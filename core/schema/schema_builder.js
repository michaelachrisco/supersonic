import fs from 'fs'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID
} from 'graphql'

export default class SchemaBuilder {
  constructor(queries) {
    let files = fs.readdirSync(`${process.cwd()}/build/app/models`)
    this.models = {}
    files.forEach(file => {
      if (file.match(/\.js$/)) {
        var name = file.replace(/\.js/g, '').capitalize().singularize()
        this.models[name] = require(process.cwd() + '/build/app/models/' + file).default
      }
    })
    this.types = {}
    this.queries = queries
  }

  getType(dataType) {
    switch(true) {
      case /timestamp/.test(dataType):
        return GraphQLString
      case /character/.test(dataType):
        return GraphQLString
      case /integer/.test(dataType):
        return GraphQLInt
      case /double/.test(dataType):
        return GraphQLFloat
      case /boolean/.test(dataType):
        return GraphQLBoolean
      case /uuid/.test(dataType):
        return GraphQLID
    }
  }

  generateTypes() {
    for (let name in this.models) {
      let columns = this.models[name].attributes
      let fields = {}

      for (let columnName in columns) {
        console.log(columnName)
        fields[columnName] = {
          type: this.getType(column[columnName])
        }
      }

      this.types[`${name.underscore()}`] = new GraphQLObjectType({
        name: name,
        fields: fields
      })
    }
    return true
  }

  schema() {
    this.generateTypes()
    let fields = {}

    for (let type in this.types) {
      fields[type.underscore()] = {
        type: this.types[type],
        args: {
          id: { type: GraphQLID }
        },
        resolve: (_, args) => {
          return this.models[type.capitalize()].find(args.id)
        }
      }
    }

    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: fields
      })
    })
  }
}
