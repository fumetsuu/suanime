import React, { Component } from 'react'
import { connect } from 'react-redux'
import { streamMoe } from '../../util/animedownloaders/streamMoe.js'
const fs = require('fs')
const path = require('path')
const bytes = require('bytes')
import { createdlObj, clearDL, playAnime, completeDL } from '../../actions/actions.js'
import { toWordDate } from '../../util/util'

const suDownloader = require('../../suDownloader/suDownloader')

//status can be 'NOT_STARTED', 'PAUSED', 'DOWNLOADING', 'COMPLETED', 'STARTING_DOWNLOAD'
class DownloadCard extends Component {
	constructor(props) {
		super(props)
		this.startDownload = this.startDownload.bind(this)
		this.continueDownload = this.continueDownload.bind(this)
		this.clearDownload = this.clearDownload.bind(this)
		this.pauseDownload = this.pauseDownload.bind(this)
    this.playDownload = this.playDownload.bind(this)
    this.configureDownloadItem = this.configureDownloadItem.bind(this)
    this.addStatusListeners = this.addStatusListeners.bind(this)
    this.removeStatusListeners = this.removeStatusListeners.bind(this)

		if (this.props.completed) {
			let { totalSize, elapsed, completeDate } = this.props
			this.state = {
				status: 'COMPLETED',
				speed: '',
				progressSize: totalSize,
				totalSize: totalSize,
				percentage: '100',
				elapsed: elapsed,
				remaining: '0',
				completeDate: completeDate
			}
		} else {
      this.configureDownloadItem()
			this.state = {
				status: 'NOT_STARTED',
				speed: '0 B/s',
				progressSize: '0MB',
				totalSize: '0MB',
				percentage: 0,
				elapsed: 0,
				remaining: 0
			}
		}
	}

	componentDidMount() {
    if(!this.downloadItem && !this.props.completed) {
      suDownloader.on('new_download_started', this.configureDownloadItem)
    }
	}

	componentWillUnmount() {
    this.removeStatusListeners()
    suDownloader.removeListener('new_download_started', this.configureDownloadItem)
  }

	render() {
		var controlIcon
		var controlAction
		var controlClass = 'download-control-btn'
		var statusText
		var clearClass = 'download-control-btn redbghover'
		switch (this.state.status) {
			case 'NOT_STARTED': {
				controlIcon = 'play_arrow'
				statusText = 'Not Yet Started'
				controlAction = this.startDownload
				break
			}
			case 'DOWNLOADING': {
				controlIcon = 'pause'
				statusText = 'Downloading'
				controlAction = this.pauseDownload
				break
			}
			case 'PAUSED': {
				controlIcon = 'play_arrow'
				statusText = 'Paused'
				controlAction = this.continueDownload
				break
			}
			case 'ERROR': {
				controlIcon = 'play_arrow'
				statusText = 'Error - please try again later'
				controlAction = this.startDownload
				break
			}
			case 'STARTING_DOWNLOAD': {
				controlIcon = 'pause'
				controlClass = 'download-control-btn disabled'
				statusText = 'Starting Download'
				controlAction = null
				clearClass = 'download-control-btn redbghover'
				break
			}
			case 'COMPLETED': {
				controlIcon = 'live_tv'
				statusText = `Completed`
				controlAction = this.playDownload
				break
			}
			case 'NETWORK_ERROR': {
				controlIcon = 'settings_backup_restore'
				statusText = 'Network Error - please restart download'
				controlAction = this.startDownload
				break
			}
		}
		let { viewType, animeName, epTitle, posterImg } = this.props
		let downloadSize = this.state.status == 'COMPLETED' ? this.state.totalSize : this.state.progressSize + '/' + this.state.totalSize
		let percentage = this.state.status == 'COMPLETED' ? '' : `${this.state.percentage}%`
		let remaining = this.state.status == 'COMPLETED' ? '' : `|  Remaining: ${this.state.remaining}`
		if (viewType == 'ROWS') {
			return (
				<div className="download-card-container">
					<div className="download-card-img" style={{ backgroundImage: `url('${posterImg}')` }} />
					<div className="download-card-header">
						<div className="download-title">
							{animeName} <br />
							<div className="download-ep-title">{epTitle}</div>
						</div>
						<div className={controlClass} onClick={controlAction}>
							<i className="material-icons">{controlIcon}</i>
						</div>
						<div className={clearClass} onClick={this.clearDownload}>
							<i className="material-icons">clear</i>
						</div>
					</div>
					<div className="download-progress-container">
						<div className="download-status">
							{statusText}
							{this.state.completeDate ? ' - ' + toWordDate(this.state.completeDate) : ''}
						</div>
						<div className="download-network-data">
							{this.state.speed} | {downloadSize} {percentage ? '| ' + percentage : ''} | Elapsed: {this.state.elapsed} {remaining}
						</div>
						<div className="download-progress-bar-container">
							<div className="download-progress-bar" style={{ width: this.state.percentage + '%' }} />
						</div>
					</div>
				</div>
			)
		} else if (viewType == 'COMPACT') {
			let statusColour = this.state.status == 'COMPLETED' ? '#51e373' : this.state.status == 'NOT_STARTED' || this.state.status == 'STARTING_DOWNLOAD' ? '#dadada' : '#f55353'
			statusColour = this.state.status == 'DOWNLOADING' ? 'transparent' : statusColour
			return (
				<div className="download-card-container download-card-container-compact">
					<div className="status-circle" style={{ backgroundColor: statusColour }} />
					<div className="download-title">
						{animeName} - {epTitle}
					</div>
					<div className="download-complete-date">{this.state.completeDate ? toWordDate(this.state.completeDate) : statusText}</div>
					<div className="download-progress-bar-container">
						<div className="download-progress-bar" style={{ width: this.state.percentage == 100 ? 0 : this.state.percentage + '%' }} />
					</div>
					<div className="download-network-data download-speed">{this.state.speed}</div>
					<div className="download-network-data download-size">{downloadSize}</div>
					<div className="download-network-data download-percentage">{percentage}</div>
					<div className="download-network-data download-elapsed">{this.state.elapsed}</div>
					<div className="download-network-data download-remaining">{this.state.status == 'COMPLETED' ? '' : this.state.remaining}</div>
					<div className={controlClass} onClick={controlAction}>
						<i className="material-icons">{controlIcon}</i>
					</div>
					<div className={clearClass} onClick={this.clearDownload}>
						<i className="material-icons">clear</i>
					</div>
				</div>
			)
		}
	}

	startDownload() {
    suDownloader.startDownload(this.props.animeFilename)
    this.setState({
      status: 'STARTING_DOWNLOAD'
    })
	}

	pauseDownload() {
    suDownloader.pauseDownload(this.props.animeFilename)
    this.setState({
      status: 'PAUSED'
    })
	}

	continueDownload() {
    suDownloader.resumeDownload(this.props.animeFilename)
    this.setState({
      status: 'DOWNLOADING'
    })
	}

	playDownload() {
		var animeName = this.props.animeName
		var videoFile = path.join(global.estore.get('downloadsPath'), this.props.animeFilename)
		var epNumber = this.props.epTitle
		var posterImg = this.props.posterImg
		var slug = this.props.epLink.split('watch/')[1].split('/')[0]
		this.props.playAnime(videoFile, animeName, epNumber, posterImg, slug)
		window.location.hash = '#/watch'
	}

	clearDownload() {
		if (confirm('Are you sure you want to delete ' + this.props.animeFilename + '?')) {
      if(this.downloadItem) {
        suDownloader.clearDownload(this.props.animeFilename, true)
      }
			this.props.clearDL(this.props.animeFilename)
		}
  }
    
  configureDownloadItem() {
    let downloadItem = suDownloader.getActiveDownload(this.props.animeFilename)
    this.downloadItem = downloadItem
    this.addStatusListeners()
  }

  removeStatusListeners() {
    if(!this.downloadItem) return false
    this.downloadItem.removeAllListeners('progress')
    this.downloadItem.removeAllListeners('error')
    this.downloadItem.removeAllListeners('finish')
  }

  addStatusListeners() {
    if(!this.downloadItem) return false
    this.downloadItem
      .on('progress', x => {
        if(x.future.eta == 'Infinity' || isNaN(x.future.eta)) return false
        var status = 'DOWNLOADING'
        var speed = bytes(x.present.speed) + '/s'
        var progressSize = bytes(x.total.downloaded)
        var totalSize = bytes(x.total.size)
        var percentage = x.total.completed
        var elapsed = (x.present.time / 1000).toFixed(2)
        var remaining = (x.future.eta).toFixed(2)
        this.setState({
          status,
          speed,
          progressSize,
          totalSize,
          percentage,
          elapsed,
          remaining
        })
      })
      .on('error', err => console.log(err))
      .on('finish', x => {
        this.removeStatusListeners()
        console.log('finished....?')
        var completeDate = Date.now()
        this.setState({
          status: 'COMPLETED',
          speed: '',
          progressSize: x.total.size,
          percentage: '100',
          remaining: '0',
          elapsed: (x.present.time / 1000).toFixed(2),
          completeDate
      })
      this.props.completeDL(this.props.animeFilename, x.total.size, (x.present.time / 1000).toFixed(2), completeDate)
      })

  }
}

const mapDispatchToProps = dispatch => {
	return {
		clearDL: animeFilename => dispatch(clearDL(animeFilename)),
    playAnime: (videoFile, animeName, epNumber, posterImg, slug) => dispatch(playAnime(videoFile, animeName, epNumber, posterImg, slug)),
    completeDL: (animeFilename, totalSize, elapsed, completeDate) => dispatch(completeDL(animeFilename, totalSize, elapsed, completeDate))
	}
}


export default connect(null, mapDispatchToProps)(DownloadCard)
