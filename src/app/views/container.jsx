import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import effects from 'redux-effects'
import fetch from 'redux-effects-fetch'
import Immutable from 'immutable'
import jwt from 'jsonwebtoken'
import reducers from '../reducers/application_reducer'
import App from './layouts/app'
import { setUser } from '../actions/application_actions'

export default class Container extends React.Component {
  componentWillMount() {
    let createStoreWithMiddleware = applyMiddleware(
      effects,
      fetch
    )(createStore)
    this.store = createStoreWithMiddleware(reducers)
  }

  componentDidMount() {
    let user = jwt.decode(window.sessionStorage.user)
    this.store.dispatch(setUser(user))
  }

  render() {
    return (
      <Provider store={this.store}>
        <App children={this.props.children} />
      </Provider>
    )
  }
}
