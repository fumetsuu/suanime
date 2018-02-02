import React, { Component } from 'react'

export default class DownloadCard extends Component {
  render() {
    downloadEpInternal(this.props.epLink, this.props.animeFilename)
    return (
      <div className="download-card-container">
        {this.props.animeFilename}
      </div>
    )
  }
}

function downloadEpInternal(epLink, animeFilename) {
  console.log(epLink, animeFilename)
}