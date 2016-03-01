import * as r from 'graphql-relay'
import * as models from '~/app/models'

const { nodeInterface, nodeField } = r.nodeDefinitions(
  (globalId) => {
    const { type, id } = r.fromGlobalId(globalId)
    return models[type.replace(/Type/, '')].find(id)
  },
  (obj) => {
    return models[obj.name].schema()
  }
)

export { nodeInterface, nodeField }
