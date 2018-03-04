import React, { Component } from 'react'
import { connect } from 'react-redux'
import { streamMoe } from '../../util/animedownloaders/streamMoe.js'
const fs = require('fs')
const path = require('path')
import { createdlObj, clearDL, playAnime } from '../../actions/actions.js'
import { toWordDate } from '../../util/util'

//status can be 'NOT_STARTED', 'PAUSED', 'DOWNLOADING', 'COMPLETED', 'STARTING_DOWNLOAD'
class DownloadCard extends Component {
  constructor(props) {
    super(props)
    this.updateProgress = this.updateProgress.bind(this)
    this.startDownload = this.startDownload.bind(this)
    this.continueDownload = this.continueDownload.bind(this)
    this.clearDownload = this.clearDownload.bind(this)
    this.pauseDownload = this.pauseDownload.bind(this)
    this.playDownload = this.playDownload.bind(this)

    if(this.props.completed) {
      let { totalSize, elapsed, completeDate } = this.props
      this.state = {
        status: 'COMPLETED',
        speed: '',
        progressSize: totalSize,
        totalSize: totalSize,
        percentage: '100',
        elapsed: elapsed,
        remaining: '0 sec',
        completeDate: completeDate
      }
    } else {
      var dlObjsFROMTREE = this.props.dlObjsFROMTREE
      dlObjsFROMTREE.some(dlObj => {
        if(dlObj.id == this.props.animeFilename) {
          this.dlObj = dlObj.dlObj
          this.dlObj.fixComp(this.updateProgress)      
          return true
        }
      })
      if(!this.dlObj) {
        this.dlObj = new streamMoe()
        this.dlObj.setArgs(this.props.epLink, this.props.animeFilename, this.updateProgress) 
        this.props.createdlObj(this.props.animeFilename, this.dlObj)
      }
      this.state = {}
    }
  
  }

  componentDidMount() {
    if(this.dlObj) {
      this.dlObj.updateState()
    }
  }

  render() {
    var controlIcon
    var controlAction
    var controlClass = "download-control-btn"
    var statusText
    var clearClass = "download-control-btn redbghover"
    switch(this.state.status) {
      case 'NOT_STARTED': {
        controlIcon = "play_arrow"
        statusText = "Not Yet Started"
        controlAction = this.startDownload
        break
      }
      case 'DOWNLOADING': {
        controlIcon = "pause"
        statusText = "Downloading"
        controlAction = this.pauseDownload
        break
      }
      case 'PAUSED': {
        controlIcon = "play_arrow"
        statusText = "Paused"
        controlAction = this.continueDownload
        break
      }
      case 'ERROR': {
        controlIcon = "play_arrow"
        statusText = "Error - please try again later"
        controlAction = this.startDownload
        break
      }
      case 'STARTING_DOWNLOAD': {
        controlIcon = "pause"
        controlClass = "download-control-btn disabled"
        statusText = "Starting Download"
        controlAction = null
        clearClass = "download-control-btn redbghover"
        break
      }
      case 'COMPLETED': {
        controlIcon = "live_tv"
        statusText = `Completed`
        controlAction = this.playDownload
        break
      }
      case 'NETWORK_ERROR': {
        controlIcon = "settings_backup_restore"
        statusText = "Network Error - please restart download"
        controlAction = this.startDownload
        break
      }
    }
    let { viewType, animeName, epTitle, posterImg } = this.props
    let downloadSize = this.state.status == 'COMPLETED' ? this.state.totalSize : this.state.progressSize+'/'+this.state.totalSize
    let percentage = this.state.status == 'COMPLETED' ? '' : `${this.state.percentage}%`
    let remaining = this.state.status == 'COMPLETED' ? '' : `|  Remaining: ${this.state.remaining}`
    if(viewType == 'ROWS') {
      return (
        <div className="download-card-container">
          <div className="download-card-img" style={{backgroundImage: `url('${posterImg}')`}}/>
          <div className="download-card-header">
            <div className="download-title">{animeName} <br></br> 
              <div className="download-ep-title">{epTitle}</div>          
            </div>
            <div className={controlClass} onClick={controlAction}><i className="material-icons">{controlIcon}</i></div>
            <div className={clearClass} onClick={this.clearDownload}><i className="material-icons">clear</i></div>
          </div>
          <div className="download-progress-container">
            <div className="download-status">{statusText}{this.state.completeDate?' - '+toWordDate(this.state.completeDate):''}</div>
            <div className="download-network-data">{this.state.speed}  |  {downloadSize}  {percentage ? '| '+percentage:''}  |  Elapsed: {this.state.elapsed}  {remaining}</div>
            <div className="download-progress-bar-container">
              <div className="download-progress-bar" style={{width: this.state.percentage+'%'}}/>
            </div>
          </div>
        </div>
      )
    } else if(viewType == 'COMPACT') {
      let statusColour = this.state.status == 'COMPLETED' ? '#51e373' : (this.state.status == 'NOT_STARTED' || this.state.status == 'STARTING_DOWNLOAD' ? '#dadada' : '#f55353')
      statusColour = this.state.status == 'DOWNLOADING' ? 'transparent' : statusColour
      return (
        <div className="download-card-container download-card-container-compact">
          <div className="status-circle" style={{backgroundColor: statusColour}}/>
          <div className="download-title">{animeName} - {epTitle}</div>
          <div className="download-complete-date">{this.state.completeDate?toWordDate(this.state.completeDate):statusText}</div>
          <div className="download-progress-bar-container">
            <div className="download-progress-bar" style={{width: this.state.percentage==100?0:this.state.percentage+'%'}}/>
          </div>
          <div className="download-network-data download-speed">{this.state.speed}</div>
          <div className="download-network-data download-size">{downloadSize}</div>
          <div className="download-network-data download-percentage">{percentage}</div>
          <div className="download-network-data download-elapsed">{this.state.elapsed}</div>
          <div className="download-network-data download-remaining">{this.state.status == 'COMPLETED' ? '' : this.state.remaining}</div>
          <div className={controlClass} onClick={controlAction}><i className="material-icons">{controlIcon}</i></div>
          <div className={clearClass} onClick={this.clearDownload}><i className="material-icons">clear</i></div>
        </div>
      )
    }
  }

  startDownload() {
    this.setState({ status: 'STARTING_DOWNLOAD' })
    this.dlObj.start()
  }

  pauseDownload() {
    this.dlObj.pause()
  }

  continueDownload() {
    this.dlObj.continue()
  }

  playDownload() {
    var animeName = this.props.animeName
    var videoFile = path.join(__dirname, ('../downloads/'+this.props.animeFilename))
    var epNumber = this.props.epTitle
    var posterImg = this.props.posterImg
    var slug = this.props.epLink.split("watch/")[1].split("/")[0]
    this.props.playAnime(videoFile, animeName, epNumber, posterImg, slug)
    window.location.hash="#/watch"
  }

  updateProgress(newState) {
    this.setState(newState)
  }

  clearDownload() {
    if(confirm("Are you sure you want to delete "+this.props.animeFilename+"?")) {
      if(this.dlObj) {
        this.dlObj.delete()
      }
      this.props.clearDL(this.props.animeFilename)    
      fs.unlinkSync(path.join(__dirname, '../downloads/'+this.props.animeFilename))
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createdlObj: (animeFilename ,newdlObj) => dispatch(
		createdlObj(animeFilename, newdlObj)
	),
    clearDL: (animeFilename) => dispatch(clearDL(animeFilename)),
    playAnime: (videoFile, animeName, epNumber, posterImg, slug) => dispatch(
		playAnime(videoFile, animeName, epNumber, posterImg, slug)
	)
  }
}

const mapStateToProps = state => {
  return {
    dlObjsFROMTREE: state.downloadsReducer.dlObjs
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadCard)