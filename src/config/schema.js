import * as g from 'graphql'
import * as schema from '~/app/schema'

const Schema = new g.GraphQLSchema({
  query: schema.queryType,
  // Uncomment this when you have some mutations defined
  // mutation: schema.mutationType
})

export { Schema }
