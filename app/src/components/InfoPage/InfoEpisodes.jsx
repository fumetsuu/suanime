import React, { Component } from 'react'
import InfoEpisodeCard from './InfoEpisodeCard.jsx'
// const rp = require('request-promise')
const cloudscraper = require('cloudscraper')
import Loader from '../Loader/Loader.jsx'
import { fixURLMA, fixURL, genFilename } from '../../util/util.js'
import { connect } from 'react-redux'
import { queueDLAll } from '../../actions/actions';
import { processExceptions } from './processExceptions';

class InfoEpisodes extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			hasDownloadedAll: false,
			epCards: [],
			error: ''
		}

		this.stateFromID = this.stateFromID.bind(this)
		this.stateFromName = this.stateFromName.bind(this)
		this.checkDownloaded = this.checkDownloaded.bind(this)
	}
	
	
	componentWillMount() {
		if(this.props.animeID == "null") {
			this.stateFromName(this.props.animeName)
		} else {
			this.stateFromID(this.props.animeID)
		}
	}
	
	stateFromID(id) {
		const reqURL = `https://www.masterani.me/api/anime/${id}/detailed`
		var epCards = []
		cloudscraper.request({ method: 'GET', url: reqURL }, (err, res, body) => {
			if(err) throw err
			var data = JSON.parse(body)
			data.episodes.forEach(ep => {
				epCards.push(<InfoEpisodeCard key={ep.info.id} epData={ep.info} broadData={data.info} poster={data.poster}/>)
			})
			this.setState({
				isLoading: false,
				epCards
			}, this.checkDownloaded)
		})
	}

	stateFromName(animeName) {
		const searchURL = `https://www.masterani.me/api/anime/search?search=${fixURLMA(animeName)}&sb=1`
		console.log(fixURLMA(animeName), animeName, searchURL)
		cloudscraper.request({ method: 'GET', url: searchURL }, (err, res, body) => {
			if(err) throw err
			var searchResults = JSON.parse(body)
			let searchHit = processExceptions(searchResults, animeName, true)
			if(!searchHit) {
				this.setState({
					isLoading: false,
					epCards: null,
					error: 'No Episodes Found'
				})
				return false
			}
			let id = searchHit.id
		 this.stateFromID(id)
		})
	}

	render() {
		let { isLoading, epCards, hasDownloadedAll } = this.state
		if(isLoading) {
			return <Loader loaderClass="central-loader"/>
		}
		var downloadAllClass = hasDownloadedAll ? 'download-all disabled' : 'download-all'
		return (
			<div className="info-episodes-wrapper">
				<div className="info-episodes-container">
					{epCards ?
						<div className={downloadAllClass} onClick={this.downloadAll.bind(this)}>Download All Episodes</div>
						:null}
					{epCards?epCards:<div className="noeps">{this.state.error}</div>}
				</div>
			</div>
		)
	}

	downloadAll() {
		this.setState({ hasDownloadedAll: true })
		let { downloading, completed } = this.props    
		let { epCards } = this.state
		let paramsArray = []
		let title
		epCards.forEach(el => {
			title = el.props.broadData.title
			let { episode } = el.props.epData
			var animeFilename = genFilename(title, episode)
			if(downloading.includes(el.animeFilename) || completed.includes(animeFilename)) return false
			let { poster } = el.props
			let { slug } = el.props.broadData
			var epLink = `https://www.masterani.me/anime/watch/${slug}/${episode}`
			var posterImg = `https://cdn.masterani.me/poster/${poster}`
			var epTitle = 'Episode '+episode
			paramsArray.push({ epLink, animeFilename, posterImg, title, epTitle })
		})
		this.props.queueDLAll(paramsArray, title)
	}

	checkDownloaded() {
		let { epCards } = this.state
		let { downloading, completed } = this.props
		var hasDownloadedAll = epCards.every(el => {
			let title = el.props.broadData.title
			let { episode } = el.props.epData
			var animeFilename = genFilename(title, episode)
			return (downloading.includes(animeFilename) || completed.includes(animeFilename))
		})
		this.setState({ hasDownloadedAll })
	}
}

const mapStateToProps = state => {
	return {
		downloading: state.downloadsReducer.downloading,
		completed: state.downloadsReducer.completed
	}
}

const mapDispatchToProps = dispatch => {
	return {
		queueDLAll: (optsArray, animeName) => dispatch(queueDLAll(optsArray, animeName))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoEpisodes)