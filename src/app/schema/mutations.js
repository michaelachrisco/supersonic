import * as g from 'graphql'
import * as models from '~/app/models'

const mutationType = new g.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // This cannot be empty when attempting to build the schema using the
    // babel relay plugin. Be sure to add some mutations and uncomment the
    // mutations line in the schema.js file
  })
})

export default mutationType
