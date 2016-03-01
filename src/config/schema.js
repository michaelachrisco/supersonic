import * as g from 'graphql'
import * as schema from '~/app/schema'

const Schema = new g.GraphQLSchema({
  query: schema.queryType,
  mutation: schema.mutationType
})

export { Schema }
