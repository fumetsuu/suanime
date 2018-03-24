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
//status can be 'QUEUED', 'QUEUED_R', 'PAUSED', 'DOWNLOADING', 'COMPLETED', 'FETCHING_URL'
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
		this.checkPersisted = this.checkPersisted.bind(this)

		if (this.props.completed) {
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
      this.configureDownloadItem()
			this.state = this.props.persistedState || {
				status: 'FETCHING_URL',
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
		if(!this.props.completed) {
			this.checkPersisted()
			suDownloader.on('error', x => {
				if(x.key == this.props.animeFilename) {
					console.log(x.err)
					this.setState({ status: 'ERROR' })
				}
			})
		}
    	if(!this.downloadItem && !this.props.completed) {
			suDownloader.on('new_download_started', this.configureDownloadItem)
			suDownloader.on('new_download_queued', this.configureDownloadItem)
		}
	}

	componentWillUnmount() {
    this.removeStatusListeners()
    suDownloader.removeListener('new_download_started', this.configureDownloadItem)
	suDownloader.removeListener('new_download_queued', this.configureDownloadItem)
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
			case 'PAUSED': {
				controlIcon = 'play_arrow'
				statusText = 'Paused'
				controlAction = this.continueDownload
				break
			}
			case 'ERROR': {
				controlIcon = 'play_arrow'
				statusText = 'Error - 404'
				controlAction = this.startDownload
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
		let { viewType, animeName, epTitle, posterImg } = this.props
		let isCompleted = this.state.status == 'COMPLETED'
		let isPaused = this.state.status == 'PAUSED' || this.state.status == 'QUEUED' || this.state.status == 'QUEUED_R'
		let downloadSize = isCompleted ? this.state.progressSize : this.state.progressSize + '/' + this.state.totalSize
		let percentage = isCompleted ? '' : `${this.state.percentage}%`
		let remaining = (isCompleted || isPaused) ? '' : this.state.remaining
		let speed = isPaused ? '' : this.state.speed
		let statusColour = isCompleted ? '#51e373' : this.state.status == 'FETCHING_URL' ? '#dadada' : (this.state.status == 'QUEUED' || this.state.status == 'QUEUED_R') ? '#fec42f' :'#f55353'
		statusColour = this.state.status == 'DOWNLOADING' ? 'transparent' : statusColour
		if (viewType == 'ROWS') {
			return (
				<div className="download-card-container">
					<div className="download-card-header">
						<div className="status-circle" style={{ backgroundColor: statusColour }} />
						<div className="download-title">
							{animeName} - {epTitle}
						</div>
						<div className="download-complete-date">{this.state.completeDate ? toWordDate(this.state.completeDate) : statusText}</div>
						<div className="download-network-data download-speed">{speed}</div>
						<div className="download-network-data download-size">{downloadSize}</div>
						<div className="download-network-data download-percentage">{percentage}</div>
						<div className="download-network-data download-elapsed">{this.state.elapsed}</div>
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
			let titleclick = isCompleted ? this.playDownload : () => {}
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
					<div className="download-network-data download-elapsed">{this.state.elapsed}</div>
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
			getDownloadLink(epLink).then(downloadURL => {
				const dlOptions = {
					key: animeFilename,
					path: path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}/${fixFilename(animeFilename)}`),
					url: downloadURL
				}
				console.log(suDownloader)
				suDownloader.QueueDownload(dlOptions)
			}).catch(err => {
				console.log(err)
				this.setState({ status: 'ERROR' })
			})
		} else {
			suDownloader.startDownload(this.props.animeFilename)
			this.setState({
				status: 'FETCHING_URL'
			})
		}
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
		
	checkPersisted() {
		let downloadItem = suDownloader.getActiveDownload(this.props.animeFilename)
		var mtdpath =  path.join(global.estore.get('downloadsPath'), `${fixFilename(this.props.animeName)}/${fixFilename(this.props.animeFilename)}.mtd`)
		if(downloadItem && fs.existsSync(mtdpath)) {
			if(downloadItem.status != 'DOWNLOADING') {
				this.setState({ status: 'QUEUED_R' })
			}
			this.downloadItem = downloadItem
			this.addStatusListeners()
		} else {
			let downloadOptions = suDownloader.getQueuedDownload(this.props.animeFilename)
			if(downloadOptions) {
				this.setState({ status: 'QUEUED' })
			}
		}
	}

  configureDownloadItem(key) {
		if(key == this.props.animeFilename) {
			let downloadItem = suDownloader.getActiveDownload(this.props.animeFilename)
			if(downloadItem) {
				this.downloadItem = downloadItem
				this.addStatusListeners()
			}
			 else {
				let downloadOptions = suDownloader.getQueuedDownload(this.props.animeFilename)
				if(downloadOptions) {
					this.setState({ status: 'QUEUED' })
				}
			}
		}
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
        if(x.future.eta == 'Infinity' || isNaN(x.future.eta)) return false
        var status = 'DOWNLOADING'
        var speed = bytes(x.present.speed) + '/s'
        var progressSize = bytes(x.total.downloaded)
        var totalSize = bytes(x.total.size)
        var percentage = (x.total.completed).toFixed(2)
        var elapsed = convertSec(Math.round((x.present.time / 1000)))
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
					elapsed: convertSec(Math.round(x.present.time / 1000)),
					completeDate: Date.now()
				})
				this.removeStatusListeners()
			})
  }
}

const mapDispatchToProps = dispatch => {
	return {
	clearDL: animeFilename => dispatch(clearDL(animeFilename)),
    persistDL: (animeFilename, persistedState) => dispatch(persistDL(animeFilename, persistedState))
	}
}


export default connect(null, mapDispatchToProps)(DownloadCard)