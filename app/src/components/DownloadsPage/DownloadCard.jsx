import React, { Component } from 'react'
import { connect } from 'react-redux'

class DownloadCard extends Component {
  constructor(props) {
    super(props)
    console.log("hi... :(", this.props.posterImg)
  }

  render() {
    return (
      <div className="download-card-container">
        <div className="download-card-img" style={{backgroundImage: `url('${this.props.posterImg}')`}}/>
        <div className="download-card-header">
          <div className="download-title">{this.props.animeFilename} <br></br> 
            <div className="download-ep-title">Ep 4 - Title</div>          
          </div>
          <div className="download-control-btn"><i className="material-icons">pause</i></div>
          <div className="download-control-btn"><i className="material-icons">clear</i></div>
        </div>
        <div className="download-progress-container">
          <div className="download-status">Downloading</div>
          <div className="download-network-data">216kB/s  |  42.3MB/71MB  |  61.2%</div>
          <div className="download-progress-bar-container">
            <div className="download-progress-bar"></div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleComplete: (epLink, animeFilename) => dispatch({
      type: 'COMPLETE_DOWNLOAD',
      payload: {
        epLink: epLink,
        animeFilename: animeFilename,
        status: 'COMPLETE'
      }
    })
  }
}

export default connect(null, mapDispatchToProps)(DownloadCard)