import React, { Component } from 'react'

export default class InfoEpisodes extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div className="info-episodes">
        {JSON.stringify(this.props)}
      </div>
    )
  }
}
