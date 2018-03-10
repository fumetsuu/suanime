import React, { Component } from 'react'

export default class SeasonalContainer extends Component {
  render() {
    return (
      <div className="seasonal-wrapper">
        {JSON.stringify(this.props)}
      </div>
    )
  }
}
