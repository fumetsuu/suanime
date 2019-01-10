import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import { connect } from 'react-redux'
import { scoresData, statusData } from '../IntegrationPage/AnimeList/maldata.js'
import { updateAnime, launchInfo, addAnime } from '../../actions/actions.js'
import { myStatusToColour } from '../../util/animelist.js'

class SeasonalCard extends Component {
	constructor(props) {
		super(props)
		this.updateScore = this.updateScore.bind(this)
		this.updateStatus = this.updateStatus.bind(this)
		this.addToList = this.addToList.bind(this)
		this.launchInfoPage = this.launchInfoPage.bind(this)
	}
	
	// <div className="stat-data middle">{average_episode_duration && average_episode_duration < 900 ? 'Short' : (type.length < 4 ? type.toUpperCase() : type[0].toUpperCase()+type.substr(1))}</div>
	
	render() {
		let { title, image_url, episodes, source, score, synopsis, airing_start } = this.props.animeData
		let animelistObj = this.props.listdata ? this.props.listdata.find(el => el.series_animedb_id == id) : null
		return (
			<div className="seasonal-card">
				<div className="bg-img" style={{ backgroundImage: `url('${(image_url || 'http://sweettutos.com/wp-content/uploads/2015/12/placeholder.png')}')` }}/>
				<div className="left-data">
					<div className="anime-title" onClick={this.launchInfoPage}>{title}</div>
				</div>
				<div className="right-data">
					<div className="stats-data anime-meta">
						<div className="stat-data">{score?score:'-'}</div>
						<div className="stat-data">{!episodes?'?':episodes} eps</div>
					</div>
					{this.props.listdata ? (animelistObj ?
						<div className="list-edit">
							<Dropdown className="scores-dropdown" value={scoresData.find(el => el.value == animelistObj.my_score)} options={scoresData} onChange={this.updateScore} key="scores"/>
							<Dropdown className={'status-dropdown '+myStatusToColour(animelistObj.my_status)} value={statusData.find(el => el.value == animelistObj.my_status)} options={statusData} onChange={this.updateStatus} key="statuses"/>
						</div>
						: <div className="list-edit"><div className="add-to-list" onClick={this.addToList}>Add To List</div></div>) : <div className="empty"/>
					}
					<div className="anime-synopsis">{synopsis}</div>
					<div className="broadcast-data">{airing_start}</div>
					<div className="bottom">
						<div className="stat-data first-bottom">{source ? source.replace(/_/g, ' ') : ''}</div>
						<div className="stat-data">-</div>
					</div>
				</div>
			</div>
		)
	}

	updateScore(selected) {
		var newScore = selected.value
		let { id } = this.props.animeData
		this.props.pclient.updateAnime(id, {
			score: newScore
		})
		var updatedObj = {
			my_score: newScore
		}
		this.props.updateAnime(id, updatedObj)
	}

	updateStatus(selected) {
		var newStatus = selected.value
		let { id } = this.props.animeData
		this.props.pclient.updateAnime(id, {
			status: newStatus
		})
		var updatedObj = {
			my_status: newStatus
		}
		this.props.updateAnime(id, updatedObj)
	}

	addToList() {
		// let { id, title, status, start_date, end_date, image_url, episodes, type } = this.props.animeData
		// var typeAsCode = typeToCode(type)
		// var statusAsCode = statusToCode(status)
		// var newAnimeListObject = {
		//     'series_animedb_id': id,
		//     'series_title': title,
		//     'series_type': typeAsCode,
		//     'series_episodes': episodes,
		//     'series_status': statusAsCode,
		//     'series_start': start_date,
		//     'series_end': end_date,
		//     'series_image': image_url,
		//     'my_watched_episodes': 0,
		//     'my_start_date': '0000-00-00',
		//     'my_finish_date': '0000-00-00',
		//     'my_score': 0,
		//     'my_status': 6,
		//     'my_rewatching': 0,
		//     'my_rewatching_ep': 0,
		//     'my_last_updated': Date.now() / 1000,
		//     'my_tags': []
		// }
		// this.props.pclient.addAnime(id, {
		//     status: 6
		// })
		// this.props.addAnime(id, newAnimeListObject)
	}

	launchInfoPage() {
		let { mal_id, title } = this.props.animeData
		launchInfo(title, null, null, mal_id)
	  }
}

const mapStateToProps = state => {
	return {
		// pclient: state.animelistReducer.pclient,
		listdata: state.animelistReducer.listdata
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateAnime: (malID, updatedObj) => dispatch(updateAnime(malID, updatedObj)),
		addAnime: (malID, animeObj) => dispatch(addAnime(malID, animeObj))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SeasonalCard)