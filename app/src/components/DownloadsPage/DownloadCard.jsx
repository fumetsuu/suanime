import React, { Component } from 'react'
import { connect } from 'react-redux'
import { streamMoe } from '../../util/animedownloaders/streamMoe.js'

//status can be 'NOT_STARTED', 'PAUSED', 'DOWNLOADING', 'COMPLETED'
class DownloadCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dlObj: null,
      status: "NOT_STARTED",
      speed: "0 B/s",
      progressSize: "0MB",
      totalSize: "0MB",
      percentage: 0,
      elapsed: 0,
      remaining: 0
    }
  }

  render() {
    var controlIcon
    var controlAction
    var statusText
    switch(this.state.status) {
      case 'NOT_STARTED': {
        controlIcon = "play_arrow"
        statusText = "Not Yet Started"
        controlAction = this.startDownload.bind(this)
        break
      }
      case 'DOWNLOADING': {
        controlIcon = "pause"
        statusText = "Downloading"
        controlAction = this.pauseDownload.bind(this)
        break
      }
      case 'PAUSED': {
        controlIcon = "play_arrow"
        statusText = "Paused"
        controlAction = this.continueDownload.bind(this)
        break
      }
      case 'COMPLETED': {
        controlIcon = "star"
        statusText = "Completed"
        controlAction = this.playDownload.bind(this)
      }
    }
    return (
      <div className="download-card-container">
        <div className="download-card-img" style={{backgroundImage: `url('${this.props.posterImg}')`}}/>
        <div className="download-card-header">
          <div className="download-title">{this.props.animeFilename} <br></br> 
            <div className="download-ep-title">Ep 4 - Title</div>          
          </div>
          <div className="download-control-btn" onClick={controlAction}><i className="material-icons">{controlIcon}</i></div>
          <div className="download-control-btn"><i className="material-icons">clear</i></div>
        </div>
        <div className="download-progress-container">
          <div className="download-status">{statusText}</div>
          <div className="download-network-data">{this.state.speed}  |  {this.state.progressSize}/{this.state.totalSize}  |  {this.state.percentage}%  |  Elapsed: {this.state.elapsed}  |  Remaining: {this.state.remaining}</div>
          <div className="download-progress-bar-container">
            <div className="download-progress-bar"></div>
          </div>
        </div>
      </div>
    )
  }

  startDownload() {
    console.log('starting download for '+this.props.animeFilename)
    this.setState({
      status: 'DOWNLOADING'
    })
    this.setState({
      dlObj: new streamMoe(this.props.epLink, this.props.animeFilename, this)
    }, ()=>{
      this.state.dlObj.start()
    })
  }
  pauseDownload() {
    console.log('pausing download for '+this.props.animeFilename)
    this.setState({
      status: 'PAUSED'
    })
  }
  continueDownload() {
    console.log('continuing download for '+this.props.animeFilename)
    this.setState({
      status: 'DOWNLOADING'
    })
  }
  playDownload() {
    console.log('playing download for '+this.props.animeFilename)
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