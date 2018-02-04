import React, { Component } from 'react'
import { connect } from 'react-redux'
import { streamMoe } from '../../util/animedownloaders/streamMoe.js'
const fs = require('fs')
const path = require('path')

//status can be 'NOT_STARTED', 'PAUSED', 'DOWNLOADING', 'COMPLETED', 'STARTING_DOWNLOAD'
class DownloadCard extends Component {
  constructor(props) {
    super(props)
    if(this.props.completed) {
      this.state = {
        status: 'COMPLETED',
        speed: '',
        progressSize: this.props.totalSize,
        totalSize: this.props.totalSize,
        percentage: '100',
        elapsed: this.props.elapsed,
        remaining: '0 sec'
      }
      console.log("state", this.state)
    } else {
      var thisdlObj
      console.log(global.estore)
      var dlObjsFROMTREE = this.props.dlObjsFROMTREE
      dlObjsFROMTREE.some(dlObj => {
        if(dlObj.id == this.props.animeFilename) {
          thisdlObj = dlObj.dlObj
          thisdlObj.fixComp(this)      
          return true
        }
      })
      if(!thisdlObj) {
        thisdlObj = new streamMoe()
        thisdlObj.setArgs(this.props.epLink, this.props.animeFilename, this) 
        this.props.createdlObj(this.props.animeFilename, thisdlObj)
      }
      this.state = {}
      console.log(thisdlObj)
      this.dlObj = thisdlObj
    }
    console.log('state from constructor ' , this.state)
  }

  componentDidMount() {
    if(this.dlObj) {
      this.dlObj.updateState()
    }
  }

  render() {
    var controlIcon
    var controlAction
    var statusText
    var clearClass = "download-control-btn"
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
      case 'ERROR': {
        controlIcon = "play_arrow"
        statusText = "Error - please try again later"
        controlAction = this.startDownload.bind(this)
        break
      }
      case 'STARTING_DOWNLOAD': {
        controlIcon = "pause"
        statusText = "Starting Download"
        controlAction = null
        clearClass = "download-control-btn disabled"
        break
      }
      case 'COMPLETED': {
        controlIcon = "star"
        statusText = "Completed"
        controlAction = this.playDownload.bind(this)
        break
      }
    }
    return (
      <div className="download-card-container">
        <div className="download-card-img" style={{backgroundImage: `url('${this.props.posterImg}')`}}/>
        <div className="download-card-header">
          <div className="download-title">{this.props.animeName} <br></br> 
            <div className="download-ep-title">{this.props.epTitle}</div>          
          </div>
          <div className="download-control-btn" onClick={controlAction}><i className="material-icons">{controlIcon}</i></div>
          <div className={clearClass} onClick={this.clearDownload.bind(this)}><i className="material-icons">clear</i></div>
        </div>
        <div className="download-progress-container">
          <div className="download-status">{statusText}</div>
          <div className="download-network-data">{this.state.speed}  |  {this.state.progressSize}/{this.state.totalSize}  |  {this.state.percentage}%  |  Elapsed: {this.state.elapsed}  |  Remaining: {this.state.remaining}</div>
          <div className="download-progress-bar-container">
            <div className="download-progress-bar" style={{width: this.state.percentage+'%'}}></div>
          </div>
        </div>
      </div>
    )
  }

  startDownload() {
    console.log('starting download for '+this.props.animeFilename)
    this.dlObj.start()
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
  clearDownload() {
    console.log('clearing download for '+this.props.animeFilename)
    this.dlObj.delete()
    this.props.clearDL(this.props.animeFilename)    
    fs.unlink(path.join(__dirname, '../downloads/'+this.props.animeFilename), err => {
      console.log('unlink: ', err)
    })
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createdlObj: (animeFilename ,newdlObj) => dispatch({
      type: 'CREATE_DLOBJ',
      payload: {
        id: animeFilename,
        dlObj: newdlObj
      }
    }),
    clearDL: (animeFilename) => dispatch({
      type: 'CLEAR_DOWNLOAD',
      payload: {
        animeFilename: animeFilename
      }
    })
  }
}

const mapStateToProps = state => {
  return {
    dlObjsFROMTREE: state.downloadsReducer.dlObjs
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadCard)