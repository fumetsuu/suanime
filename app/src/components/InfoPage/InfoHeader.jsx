import React from 'react'
import Dropdown from 'react-dropdown'
import { scoresData, statusData } from '../IntegrationPage/AnimeList/maldata'
import { connect } from 'react-redux'
import decodeHTML from 'ent/decode'
import { updateAnime, addAnime } from '../../actions/actions'
import { statusToCode, typeToCode } from '../../util/animelist'
import { browserLink } from '../../util/util'
class InfoHeader extends React.Component {
	constructor(props) {
		super(props)
		this.getAnimeListObject = this.getAnimeListObject.bind(this)
		this.state = {
			animeListObject: this.getAnimeListObject(this.props.malID)
		}
		this.updateScore = this.updateScore.bind(this)
		this.updateStatus = this.updateStatus.bind(this)
		this.incEp = this.incEp.bind(this)
		this.addToList = this.addToList.bind(this)
	}

	render() {
		let { title, title_japanese, link, masteraniLink } = this.props
		if(this.state.animeListObject) {
			var { my_watched_episodes, series_episodes, my_score, my_status } = this.state.animeListObject
		}
		return (
			<div className="info-header">
				<div className="back-button" onClick={() => {this.props.history.goBack()}}><i className="material-icons">chevron_left</i></div>
				<div className="info-header-title">
					{decodeHTML(title)}
					{title_japanese ? <div className="jp-title"><br/>JP: {decodeHTML(title_japanese)}</div> : null}
				</div>
				{this.props.listdata? (!this.state.animeListObject?<div className="add-to-list" onClick={this.addToList}>Add To List</div> : (
					<div className="list-update">
						<Dropdown className="scores-dropdown" options={scoresData} value={scoresData.find(el => el.value == my_score)} key="scores" onChange={this.updateScore}/>
						<Dropdown className="status-dropdown" options={statusData} value={statusData.find(el => el.value == my_status)}  key="statuses" onChange={this.updateStatus}/>
						<div className={my_watched_episodes==0?'prog-btn disabled':'prog-btn'} onClick={() => this.incEp(-1)}><i className="material-icons">remove</i></div>
						<div className={(my_watched_episodes==series_episodes && series_episodes!=0)?'prog-btn disabled':'prog-btn'} onClick={() => this.incEp(1)}><i className="material-icons">add</i></div>
						<div className="progress-text">{my_watched_episodes}/{series_episodes==0?'?':series_episodes}</div>
					</div>
				)) : <div className="empty"/>}    
				<div className="anime-out-link masterani-circle" onClick={() => browserLink(masteraniLink)}/>
				<div className="anime-out-link mal-circle" onClick={() => browserLink(link)}/>
			</div>
		)
	}

	getAnimeListObject(id) {
		var animelist = this.props.listdata
		if(animelist) {
			return (animelist.find(anime => {
				return anime.series_animedb_id == id
			}))
		} else {
			return null
		}
	}

	addToList() {
		let { malID, title, status, aired, image_url, episodes, type } = this.props
		var typeAsCode = typeToCode(type)
		var statusAsCode = statusToCode(status)
		var newAnimeListObject = {
			'series_animedb_id': malID,
			'series_title': title,
			'series_type': typeAsCode,
			'series_episodes': episodes,
			'series_status': statusAsCode,
			'series_start': aired.from,
			'series_end': aired.to,
			'series_image': image_url,
			'my_watched_episodes': 0,
			'my_start_date': '0000-00-00',
			'my_finish_date': '0000-00-00',
			'my_score': 0,
			'my_status': 6,
			'my_rewatching': 0,
			'my_rewatching_ep': 0,
			'my_last_updated': Date.now() / 1000,
			'my_tags': []
		}
		this.props.pclient.addAnime(malID, {
			status: 6
		})
		this.setState({
			animeListObject: newAnimeListObject
		})
		this.props.addAnime(malID, newAnimeListObject)
	}

	updateScore(selected) {
		var newScore = selected.value
		let { series_animedb_id } = this.state.animeListObject
		this.props.pclient.updateAnime(series_animedb_id, {
			score: newScore
		})
		var updatedObj = {
			my_score: newScore
		}
		this.setState({
			animeListObject: Object.assign({}, this.state.animeListObject, {
				my_score: newScore
			})
		})
		this.props.updateAnime(series_animedb_id, updatedObj)
	}

	updateStatus(selected) {
		var newStatus = selected.value
		let { series_animedb_id } = this.state.animeListObject
		this.props.pclient.updateAnime(series_animedb_id, {
			status: newStatus
		})
		var updatedObj = {
			my_status: newStatus
		}
		this.setState({
			animeListObject: Object.assign({}, this.state.animeListObject, {
				my_status: newStatus
			})
		})
		this.props.updateAnime(series_animedb_id, updatedObj)
	}

	incEp(inc) {
		let { series_animedb_id, my_watched_episodes } = this.state.animeListObject
		this.props.pclient.updateAnime(series_animedb_id, {
			episode: my_watched_episodes+inc
		})
		var updatedObj = {
			my_watched_episodes: my_watched_episodes+inc
		}
		this.setState({
			animeListObject: Object.assign({}, this.state.animeListObject, {
				my_watched_episodes: my_watched_episodes+inc
			})
		})
		this.props.updateAnime(series_animedb_id, updatedObj)
	}
}

const mapStateToProps = state => {
	return {
		pclient: state.animelistReducer.pclient,
		listdata: state.animelistReducer.listdata
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateAnime: (malID, updatedObj) => dispatch(updateAnime(malID, updatedObj)),
		addAnime: (malID, animeObj) => dispatch(addAnime(malID, animeObj))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoHeader)
