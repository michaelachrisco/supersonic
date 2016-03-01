import * as g from 'graphql'
import queries from '~/app/schema/queries'

const schema = new g.GraphQLSchema({
  query: queries
})

export default schema
