import Immutable from 'immutable'
import jwt from 'jsonwebtoken'

export default (state = Immutable.Map({}), action) => {
  switch(action.type) {
  case 'authCompleted':
    let user = jwt.decode(action.payload.data.auth.token)
    if (user) {
      window.sessionStorage.setItem('user', action.payload.data.auth.token)
    }
    return state.set('user', user)
  case 'setUser':
    return state.set('user', action.payload)
  default:
    return state
  }
}
