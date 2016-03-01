import * as g from 'graphql'
import * as models from '~/app/models'

import { nodeField } from '~/app/schema/node_type'

const queryType = new g.GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField
  }
})

export default queryType
