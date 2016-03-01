import * as g from 'graphql'
import * as mutations from './mutations/index'
import * as models from '~/app/models'

const mutationType = new g.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
  })
})

export default mutationType
