import React, { Component } from 'react'
import { connect } from 'react-redux'
import bytes from 'bytes'

import { clearDL, playAnime, persistDL } from '../../actions/actions'
import { toWordDate, convertSec } from '../../util/util'

import { downloadEmitter, genCompletedProps } from '../../util/downloadUtil'
import { persistSuD3State } from '../../util/estoreUtil'

class DownloadCard extends Component {
	constructor(props) {
		super(props)
		this.startDownload = this.startDownload.bind(this)
		this.continueDownload = this.continueDownload.bind(this)
		this.clearDownload = this.clearDownload.bind(this)
		this.pauseDownload = this.pauseDownload.bind(this)
		this.playDownload = this.playDownload.bind(this)

		this.configureDownloadItem = this.configureDownloadItem.bind(this)
		this.handleData = this.handleData.bind(this)
		this.handleError = this.handleError.bind(this)
		this.handleComplete = this.handleComplete.bind(this)

		if(this.props.completed) {
			let { progressSize, elapsed, completeDate, totalSize } = this.props.persistedState
			this.state = {
				status: 'COMPLETED',
				speed: '',
				progressSize: progressSize || totalSize,
				percentage: '100',
				elapsed,
				remaining: '0',
				completeDate
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
			this.configureDownloadItem()
		}
	}

	componentWillUnmount() {
		if(this.downloadItem && this.state.status != 'FETCHING_URL') {
			this.props.persistDL(this.props.animeFilename, this.state)
		}
		downloadEmitter.removeAllListeners(this.props.animeFilename)
  	}

	render() {
		var controlIcon
		var controlAction
		var controlClass = 'download-control-btn bluebghover'
		var statusText
		var clearClass = 'download-control-btn redbghover'
		switch (this.state.status) {
			case 'QUEUED': {
				controlIcon = 'play_arrow'
				statusText = 'Queued'
				controlAction = this.startDownload
				break
			}
			case 'DOWNLOADING': {
				controlIcon = 'pause'
				statusText = 'Downloading'
				controlAction = this.pauseDownload
				break
			}
			case 'ACTIVE': {
				controlIcon = 'pause'
				statusText = 'Active'
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
				statusText = 'Completed'
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
		let isPaused = ['PAUSED', 'QUEUED', 'ACTIVE'].includes(this.state.status)
		let downloadSize = isCompleted ? this.state.progressSize : (this.state.progressSize == 0 ? '' : this.state.progressSize + '/' + this.state.totalSize)
		let percentage = (isHide || this.state.percentage == 0) ? '' : `${this.state.percentage}%`
		let remaining = (isHide || isPaused) ? '' : this.state.remaining
		let speed = (isHide || isPaused) ? '' : this.state.speed
		var statusColour
		switch(this.state.status) {
			case 'COMPLETED': statusColour = '#51e373'; break
			case 'DOWNLOADING': statusColour = '#7cebff'; break
			case 'FETCHING_URL': statusColour = '#dadada'; break
			case 'PAUSED': statusColour = '#fec42f'; break
			case 'ACTIVE': statusColour = '#2e55a1'; break
			case 'QUEUED': statusColour = '#fec42f'; break
			default: statusColour = '#f55353'
		}
		let titleclick = isCompleted ? this.playDownload : () => {}		
		if (viewType == 'ROWS') {
			return (
				<div className="download-card-container">
					<div className="download-card-header">
						<div className="status-circle" style={{ backgroundColor: statusColour }} />
						<div className={isCompleted ? 'download-title hover-blue' : 'download-title'} onClick={titleclick}>
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
					<div className={isCompleted ? 'download-title hover-blue' : 'download-title'} onClick={titleclick}>
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
		global.suDScheduler.startDownload(this.props.animeFilename)
		this.setState({ status: 'ACTIVE'})
	}

	pauseDownload() {
		global.suDScheduler.pauseDownload(this.props.animeFilename)
		this.setState({ status: 'PAUSED' })
	}

	continueDownload() {
		global.suDScheduler.startDownload(this.props.animeFilename)
		this.setState({ status: 'ACTIVE'})
	}

	playDownload() {
		let { animeName } = this.props
		var epNumber = this.props.epTitle
		var posterImg = this.props.posterImg.split('https://cdn.masterani.me/poster/')[1]
		var slug = this.props.epLink.split('watch/')[1].split('/')[0]
		playAnime(animeName, epNumber, posterImg, slug)
	}

	clearDownload() {
		global.suDScheduler.killDownload(this.props.animeFilename)
		persistSuD3State()
		this.props.clearDL(this.props.animeFilename)
	}

	configureDownloadItem() {
		var key = this.props.animeFilename
		downloadEmitter.on(key, payload => {
			var { type } = payload
			if(type == 'queued') this.setState({ status: 'QUEUED' })
			if(type == 'data') this.handleData(payload.data)
			if(type == 'error') this.handleError(payload.error)
			if(type == 'complete') this.handleComplete()
		})
	}

	handleData(x) {
		var status = 'DOWNLOADING'
		var speed = bytes(x.avgSpeed) + '/s'
		var progressSize = bytes(x.total.downloaded)
		var totalSize = bytes(x.total.filesize)
		var percentage = x.total.percentage.toFixed(2)
		var elapsed = convertSec(Math.round(x.time.elapsed / 1000))
		var remaining = convertSec(Math.round(x.time.eta))
		this.setState({
			status,
			speed,
			progressSize,
			totalSize,
			percentage,
			elapsed,
			remaining
		})
	}

	handleError(error) {
		this.setState({
			status: 'ERROR'
		})
		console.log('ERROR FOR DOWNLOAD ', this.props.animeFilename, error)
	}

	handleComplete() {
		genCompletedProps(this.state.totalSize)
		this.setState(completedObj)
		console.log(this.props.animeFilename, 'download finished')
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
