import { bind } from 'redux-effects'
import { fetch } from 'redux-effects-fetch'
import { createAction } from 'redux-actions'

export function login({email, password}) {
  let url = `http://localhost:7000/queries?query=query authUser { auth(email: "${email}", password: "${password}") { token } }`

  return bind(fetch(url, {
    method: 'POST'
  }), ({ value }) => authCompleted(value), ({ value }) => setError(value))
}

export const authCompleted = createAction('authCompleted')
export const setError = createAction('setError')
export const setUser = createAction('setUser')
