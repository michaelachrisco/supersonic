import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

export default (key, actions) => {
  return (component) => {
    return connect(state => {
      return state[key].toJS()
    }, dispatch => {
      return bindActionCreators({ ...actions }, dispatch)
    })(component)
  }
}
