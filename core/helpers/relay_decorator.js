import React from 'react'
import IsomorphicRelay from 'isomorphic-relay'
import Relay, { createContainer } from 'react-relay'

export default function(component) {
  return createContainer(component, { fragments: component.fragments })
}
