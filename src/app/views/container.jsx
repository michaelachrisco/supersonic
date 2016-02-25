import React from 'react'
import App from './layouts/app'

export default class Container extends React.Component {
  render() {
    return (
      <App children={this.props.children} />
    )
  }
}
