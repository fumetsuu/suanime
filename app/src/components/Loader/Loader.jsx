import React, { Component } from 'react'

export default class Loader extends Component {
  render() {
    console.log('im loader desu...')
    return (
      <div className={this.props.loaderClass}></div>
    )
  }
}
