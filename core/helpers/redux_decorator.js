import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

export default (keys, actions) => {
  return (component) => {
    return connect(state => {
      if (typeof keys === 'object') {
        let map = {}
        keys.forEach(key => map[key] = state[key])
        return map
      } else {
        return {
          [keys]: state[keys]
        }
      }
    }, dispatch => {
      return bindActionCreators({ ...actions }, dispatch)
    })(component)
  }
}
