import React, { Component } from 'react'
import path from 'path'
import imageCache from 'image-cache'
const tempcwd = require('electron').remote.app.getPath('userData')
imageCache.setOptions({
	dir: path.join(tempcwd, '/mal-cache/'),
	compressed: false
})
import { connect } from 'react-redux'
import { launchInfo } from '../../../actions/actions'
import { typeCodeToText, progressPercent, statusColour, makeLastUpdated, calcUpdateInterval, dateToSeason } from '../../../util/animelist.js'

class ListCard extends Component {
	constructor(props) {
		super(props)
		this.launchInfoPage = this.launchInfoPage.bind(this)
		this.pclient = props.pclient
	}

	render() {
		let { series_image, series_title, series_type, series_start, my_status, my_score, my_watched_episodes, series_episodes, series_status } = this.props.animeData
		let { viewType } = this.props
		let { lastUpdated } = this.state
		let completedseries = my_watched_episodes >= series_episodes && series_episodes != 0
		if(viewType == 'COMPACT') {
			return (
				<div className="list-card-container-compact">
					<div className="status-button" style={{background: statusColour(series_status)}}/>
					<div className="series-title" onClick={this.launchInfoPage}>{series_title}</div>
					<div className="progress-info-container">
						{!completedseries ? <div className={my_watched_episodes==0?'prog-btn disabled':'prog-btn'} onClick={() => {this.incEp(-1)}}><i className="material-icons">remove</i></div> : <div/>}
						<div className="progress-bar-container">                 
							<div className="progress-bar-progress" style={{width: progressPercent(my_watched_episodes, series_episodes)+'%'}} />
						</div>
						{!completedseries ? <div className={(my_watched_episodes==series_episodes && series_episodes!=0)?'prog-btn disabled':'prog-btn'} onClick={() => {this.incEp(1)}}><i className="material-icons">add</i></div> : <div/>}
						<div className="progress-text">{my_watched_episodes}/{!series_episodes?'?':series_episodes}</div>
					</div>
					<div className="series-type series-info">{typeCodeToText(series_type)}</div>
					<div className="series-season series-info">{dateToSeason(series_start)}</div>
					<div className="last-updated">{lastUpdated}</div>
				</div>)
		}
		let imgfile = series_image
		imageCache.fetchImages(series_image).then(images => {
			imgfile = images.hashFile
		})
		if(viewType == 'ROWS') {
			return (
				<div className="list-card-container">
					<div className="bg-img" style={{ backgroundImage: `url('${imgfile}')`}}/>
					<div className="series-information-container">
						<div className="series-title" onClick={this.launchInfoPage}>{series_title}</div>
						
						<div className="series-average series-info"></div>
						<div className="series-type series-info">Type: {typeCodeToText(series_type)}</div>
						<div className="series-season series-info">{dateToSeason(series_start)}</div>
					</div>
					<div className="my-info">
						<div className="last-updated">Last updated: {lastUpdated}</div>
						<div className="info-label">Status: </div>
						<div className="info-label">Progress: </div>
						<div className="progress-info-container">
							<div className="progress-bar-container">
								<div className="progress-bar-progress" style={{width: progressPercent(my_watched_episodes, series_episodes) + '%'}} />
							</div>
							{!completedseries ? <div className={ my_watched_episodes == 0 ? 'prog-btn disabled' : 'prog-btn' } onClick={() => {this.incEp(-1)}}><i className="material-icons">remove</i></div> : <div/>}
							{!completedseries ? <div className={(my_watched_episodes==series_episodes && series_episodes!=0)?'prog-btn disabled':'prog-btn'} onClick={() => {this.incEp(1)}}><i className="material-icons">add</i></div> : <div/>}
							<div className="progress-text">{my_watched_episodes}/{!series_episodes?'?':series_episodes}</div>
						</div>
					</div>
				</div>)
		}
		if(viewType == 'CARDS') {
			return (
				<div className="list-card-container-card">
					<div className="bg-img" style={{ backgroundImage: `url('${imgfile}')`}}/>
					<div className="series-information-container">
						<div className="row-1">
							<div className="progress-container">
								<div className={ !completedseries ? 'progress-text' : 'progress-text full' }>{my_watched_episodes}/{!series_episodes?'?':series_episodes}</div>
								{!completedseries ? <div className={my_watched_episodes==0?'prog-btn disabled':'prog-btn'} onClick={() => {this.incEp(-1)}}><i className="material-icons">remove</i></div> : <div/>}
								{!completedseries ? <div className={(my_watched_episodes==series_episodes && series_episodes!=0)?'prog-btn disabled':'prog-btn'} onClick={() => {this.incEp(1)}}><i className="material-icons">add</i></div> : <div/>}
							</div>
							<div className="last-updated">{lastUpdated}</div>
						</div>
						<div className="row-2">
							<div className="series-type series-info">{typeCodeToText(series_type)}</div>
							<div className="series-season series-info">{dateToSeason(series_start)}</div>
						</div>
					</div>
					<div className="spacer-vertical"/>
					<div className="series-title" onClick={this.launchInfoPage}>{series_title}</div>  
				</div>)
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			lastUpdated: makeLastUpdated(nextProps.animeData.my_last_updated)
		})
	}

	componentDidMount() {
		var updateInterval = calcUpdateInterval(this.props.animeData.my_last_updated)
		this.lastUpdatedTimer = updateInterval ? setInterval(() => {
			this.setState({
				lastUpdated: makeLastUpdated(this.props.animeData.my_last_updated)
			})
		}, updateInterval) : null
	}
	

	componentWillUnmount() {
		if(this.lastUpdatedTimer) {
			window.clearInterval(this.lastUpdatedTimer)
		}
	}
	launchInfoPage() {
		let { series_title, series_animedb_id } = this.props.animeData
		launchInfo(series_title, null, null, series_animedb_id)
	  }

}

const mapDispatchToProps = dispatch => {
	return {
		updateAnime: (malID, updatedObj) => dispatch(updateAnime(malID, updatedObj))
	}
}

export default connect(null, mapDispatchToProps)(ListCard)