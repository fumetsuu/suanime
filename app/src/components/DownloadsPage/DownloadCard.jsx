import React, { Component } from 'react'
import { connect } from 'react-redux'
import { streamMoe } from '../../util/animedownloaders/streamMoe.js'
const fs = require('fs')
const path = require('path')
const bytes = require('bytes')
import { createdlObj, clearDL, playAnime, completeDL, persistDL } from '../../actions/actions.js'
import { getDownloadLink } from '../../util/getDownloadLink'
import { toWordDate, fixFilename, convertSec, genVideoPath } from '../../util/util'

const suDownloader = require('../../suDownloader/suDownloader')
//status can be 'QUEUED', 'QUEUED_R', 'PAUSED', 'STARTING', 'DOWNLOADING', 'COMPLETED', 'FETCHING_URL'
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
		this.handlesuDError = this.handlesuDError.bind(this)

		if(this.props.completed) {
			let { progressSize, elapsed, completeDate, totalSize } = this.props.persistedState
			this.state = {
				status: 'COMPLETED',
				speed: '',
				progressSize: progressSize || totalSize,
				percentage: '100',
				elapsed: elapsed,
				remaining: '0',
				completeDate: completeDate
			}
		} else {
			this.state = this.props.persistedState || {
				status: 'FETCHING_URL',
				speed: '',
				progressSize: 0,
				totalSize: '',
				percentage: 0,
				elapsed: '',
				remaining: ''
			}
		}
	}

	componentDidMount() {
		if(!this.props.completed) {
			this.configureDownloadItem(this.props.animeFilename)
			this.addsuDListeners()
		}
	}

	componentWillUnmount() {
    this.removeStatusListeners()
	this.removesuDListeners()
	if(this.downloadItem && this.state.status != 'FETCHING_URL') {
      this.props.persistDL(this.props.animeFilename, this.state)
    }
  }

	render() {
		var controlIcon
		var controlAction
		var controlClass = 'download-control-btn'
		var statusText
		var clearClass = 'download-control-btn redbghover'
		switch (this.state.status) {
			case 'QUEUED': {
				controlIcon = 'play_arrow'
				statusText = 'Queued'
				controlAction = this.startDownload
				break
			}
			case 'QUEUED_R': {
				controlIcon = 'play_arrow'
				statusText = 'Queued (Resumable)'
				controlAction = this.startDownload
				break
			}
			case 'DOWNLOADING': {
				controlIcon = 'pause'
				statusText = 'Downloading'
				controlAction = this.pauseDownload
				break
			}
			case 'STARTING': {
				controlIcon = 'pause'
				statusText = 'Starting'
				controlAction = this.pauseDownload
				break
			}
			case 'PAUSED': {
				controlIcon = 'play_arrow'
				statusText = 'Paused'
				controlAction = this.continueDownload
				break
			}
			case 'FETCHING_URL': {
				controlIcon = 'pause'
				controlClass = 'download-control-btn disabled'
				statusText = 'Fetching URL'
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
			case 'ERROR': {
				controlIcon = 'settings_backup_restore'
				statusText = 'Error'
				controlAction = this.startDownload
				break
			}
		}
		let { viewType, animeName, epTitle } = this.props
		let isCompleted = this.state.status == 'COMPLETED'
		let isHide = ['COMPLETED', 'FETCHING_URL', 'ERROR'].includes(this.state.status)
		let isPaused = ['PAUSED', 'QUEUED', 'QUEUED_R', 'STARTING'].includes(this.state.status)
		let downloadSize = isCompleted ? this.state.progressSize : (this.state.progressSize == 0 ? '' : this.state.progressSize + '/' + this.state.totalSize)
		let percentage = (isHide || this.state.percentage == 0) ? '' : `${this.state.percentage}%`
		let remaining = (isHide || isPaused) ? '' : this.state.remaining
		let speed = (isHide || isPaused) ? '' : this.state.speed
		var statusColour
		switch(this.state.status) {
			case 'COMPLETED': statusColour = '#51e373'; break
			case 'DOWNLOADING': statusColour = '#7cebff'; break
			case 'FETCHING_URL': statusColour = '#dadada'; break
			case 'QUEUED': case 'QUEUED_R': statusColour = '#fec42f'; break
			case 'PAUSED': statusColour = '#fec42f'; break
			case 'STARTING': statusColour = '#2e55a1'; break
			default: statusColour = '#f55353'
		}
		let titleclick = isCompleted ? this.playDownload : () => {}		
		if (viewType == 'ROWS') {
			return (
				<div className="download-card-container">
					<div className="download-card-header">
						<div className="status-circle" style={{ backgroundColor: statusColour }} />
						<div className={isCompleted ? "download-title hover-blue" : "download-title"} onClick={titleclick}>
							{animeName} - {epTitle}
						</div>
						<div className="download-complete-date">{this.state.completeDate ? toWordDate(this.state.completeDate) : statusText}</div>
						<div className="download-network-data download-speed">{speed}</div>
						<div className="download-network-data download-size">{downloadSize}</div>
						<div className="download-network-data download-percentage">{percentage}</div>
						<div className="download-network-data download-elapsed">{isCompleted ? '' : this.state.elapsed}</div>
						<div className="download-network-data download-remaining">{remaining}</div>
						<div className={controlClass} onClick={controlAction}>
							<i className="material-icons">{controlIcon}</i>
						</div>
						<div className={clearClass} onClick={this.clearDownload}>
							<i className="material-icons">clear</i>
						</div>
					</div>
					{isCompleted ? null :
					<div className="download-progress-bar-container">
						<div className="download-progress-bar" style={{ width: this.state.percentage + '%' }} />
					</div>
					}
				</div>
			)
		} else if (viewType == 'COMPACT') {
			return (
				<div className="download-card-container download-card-container-compact">
					<div className="status-circle" style={{ backgroundColor: statusColour }} />
					<div className={isCompleted ? "download-title hover-blue" : "download-title"} onClick={titleclick}>
						{animeName} - {epTitle}
					</div>
					<div className="download-complete-date">{this.state.completeDate ? toWordDate(this.state.completeDate) : statusText}</div>
					<div className="download-progress-bar-container">
						<div className="download-progress-bar" style={{ width: isCompleted ? 0 : this.state.percentage + '%' }} />
					</div>
					<div className="download-network-data download-speed">{speed}</div>
					<div className="download-network-data download-size">{downloadSize}</div>
					<div className="download-network-data download-percentage">{percentage}</div>
					<div className="download-network-data download-elapsed">{isCompleted ? '' : this.state.elapsed}</div>
					<div className="download-network-data download-remaining">{remaining}</div>
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
		if(this.state.status == 'ERROR') {
			this.setState({ status: 'FETCHING_URL' })
			let { animeFilename, animeName, epLink } = this.props
			getDownloadLink(epLink, global.estore.get('downloadHD')).then(downloadURL => {
			var concurrent = /mp4upload/.test(downloadURL) ? 1 : 18				
				const dlOptions = {
					key: animeFilename,
					path: path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}/${fixFilename(animeFilename)}`),
					url: downloadURL,
					concurrent
				}
				console.log(suDownloader)
				suDownloader.QueueDownload(dlOptions)
			}).catch(err => {
				console.log(err)
				this.setState({ status: 'ERROR' })
			})
		} else {
			suDownloader.startDownload(this.props.animeFilename)
		}
	}

	pauseDownload() {
		suDownloader.pauseDownload(this.props.animeFilename)
		this.setState({ status: 'PAUSED' })
	}

	continueDownload() {
		suDownloader.resumeDownload(this.props.animeFilename)
	}

	playDownload() {
		let { animeName, animeFilename } = this.props
		var videoFile = genVideoPath(animeName, animeFilename)
		var epNumber = this.props.epTitle
		var posterImg = this.props.posterImg.split('https://cdn.masterani.me/poster/')[1]
		var slug = this.props.epLink.split('watch/')[1].split('/')[0]
		playAnime(animeName, epNumber, posterImg, slug)
	}

	clearDownload() {
		if(this.downloadItem) {
			suDownloader.clearDownload(this.props.animeFilename, true)
		}
		this.removeStatusListeners()
		this.props.clearDL(this.props.animeFilename)
	}

	configureDownloadItem(key) {
		if(key == this.props.animeFilename) {
			let downloadItem = suDownloader.getActiveDownload(key)
			if(downloadItem) {
				// this.clearFetchUrlErrorTimeout()
				var sudPath =  path.join(global.estore.get('downloadsPath'), `${fixFilename(this.props.animeName)}/${fixFilename(this.props.animeFilename)}.sud`)
				if(fs.existsSync(sudPath)) this.setState({ status: 'QUEUED_R' })
				if(downloadItem.status == 'STARTING') this.setState({ status: 'STARTING'})
				this.downloadItem = downloadItem
				this.addStatusListeners()
				return true
			} else {
				let downloadOptions = suDownloader.getQueuedDownload(key)
				if(downloadOptions) {
					// this.clearFetchUrlErrorTimeout()
					this.setState({ status: 'QUEUED' })
				}
				//the download is neither downloading, starting, or waiting in queue. it is therefore fetching the url or has encountered an error
				//wait 10 seconds before deciding an error has occured
				//the conditional checks to make sure that we aren't just waiting for the promises to resolve (this timeout is really only necessary for when suanime is trying to start a download
				//after being reopened and the download link wasn't found before suanime was closed)
				//this.fetchurlerrortimeout = setTimeout(() => this.setState({ status: 'ERROR' }), 10000) waiting isn't necessary?
				if(!this.props.gettingLinks.includes(key)) this.setState({ status: 'ERROR' })
				//the only event that is able to stop this timeout from starting is the one emitted by suDownloader: new_download_queued
				//this event will call configureDownloadItem and will set the status to something else, and also clear the timeout
				return false
			}
		}
	}
	
	clearFetchUrlErrorTimeout() {
		if(this.fetchurlerrortimeout)
		clearTimeout(this.fetchurlerrortimeout)
	}

	handlesuDError(x) {
		if(x.key == this.props.animeFilename) {
			console.log(x.err)
			this.setState({ status: 'ERROR' })
		}
	}

	removesuDListeners() {
		suDownloader.removeListener('new_download_started', this.configureDownloadItem)
		suDownloader.removeListener('new_download_queued', this.configureDownloadItem)
		suDownloader.removeListener('error', this.handlesuDError)
	}

	addsuDListeners() {
		suDownloader.on('new_download_started', this.configureDownloadItem)
		suDownloader.on('new_download_queued', this.configureDownloadItem)
		suDownloader.on('error', this.handlesuDError)
	}

  removeStatusListeners() {
    if(!this.downloadItem) return false
    this.downloadItem.removeAllListeners('progress')
    this.downloadItem.removeAllListeners('error')
    this.downloadItem.removeAllListeners('pause')
  }

  addStatusListeners() {
	if(!this.downloadItem) return false
	this.removeStatusListeners()
    this.downloadItem
      .on('progress', x => {
        var status = 'DOWNLOADING'
        var speed = bytes(x.present.speed) + '/s'
        var progressSize = bytes(x.total.downloaded)
        var totalSize = bytes(x.total.size)
        var percentage = (x.total.completed).toFixed(2)
        var elapsed = convertSec(Math.round(x.present.time))
        var remaining = convertSec(Math.round(x.future.eta))
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
		.on('error', err => console.log('err: ', err))
		.on('pause', () => this.setState({ status: 'PAUSED' }))
		.on('finish', x => { 
			this.setState({
				status: 'COMPLETED',
				speed: '',
				progressSize: bytes(x.total.size),
				percentage: '100',
				remaining: '0',
				elapsed: convertSec(Math.round(x.present.time)),
				completeDate: Date.now()
			})
			this.removeStatusListeners()
		})
  }
}

const mapStateToProps = state => {
	return {
		gettingLinks: state.downloadsReducer.gettingLinks
	}
}

const mapDispatchToProps = dispatch => {
	return {
		clearDL: animeFilename => dispatch(clearDL(animeFilename)),
		persistDL: (animeFilename, persistedState) => dispatch(persistDL(animeFilename, persistedState))
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(DownloadCard)
