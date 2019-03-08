import React, { Component } from 'react'
import rp from 'request-promise'
import Loader from '../Loader/Loader.jsx'
import InfoHeader from './InfoHeader.jsx'
import InfoMain from './InfoMain.jsx'
import InfoEpisodes from './InfoEpisodes.jsx'
import { fixURL } from '../../util/util.js'
import { processExceptions } from './processExceptions'

export default class InfoContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			MALData: null,
		}
		this.stateFromMAL = this.stateFromMAL.bind(this)
		this.notFoundMALData = {
			title: this.props.match.params.animeName,
			title_english: '',
			title_japanese: '',
			link_canonical: '',
			mal_id: null,
			status: null,
			aired: null,
			image_url: null,
			episodse: null,
			type: null
		}
	}

	componentDidMount() {
		let { animeName, malID } = this.props.match.params
		if(malID != 'null') {
			this.stateFromMALID(malID)
		} else {
			this.stateFromMAL(decodeURIComponent(animeName))
		}
	}

	componentWillReceiveProps(nextProps) {
		let { animeName, malID } = nextProps.match.params
		if(malID) {
			this.stateFromMALID(malID)
		} else {
			this.stateFromMAL(decodeURIComponent(animeName))
		}
	}
	
	render() {
		if(this.state.isLoading) return <Loader loaderClass="central-loader"/>
		let { animeName, slug, masteraniID } = this.props.match.params
		let { MALData } = this.state
		let { title, title_english, title_japanese, link_canonical, mal_id, status, aired, image_url, episodes, type } = MALData || this.notFoundMALData
		return (
			<div className="info-wrapper">
				<div className="info-container">
					<InfoHeader title={title} title_english={title_english} title_japanese={title_japanese} link={link_canonical} malID={mal_id} aired={aired} image_url={image_url} episodes={episodes} type={type} status={status} history={this.props.history}/>
					<InfoMain MALData={MALData}/>
					<InfoEpisodes animeName={animeName} slug={slug} animeID={masteraniID}/>
				</div>
			</div>
		)
	}

	stateFromMAL(animeName) {
		this.setState({ isLoading: true })
		const searchURL = `http://api.jikan.moe/search/anime/${fixURL(animeName)}`
		rp({ uri: searchURL, json: true }).then(results => {
			var first = processExceptions(results, animeName)
			const infoURL = `http://api.jikan.moe/anime/${first.mal_id}`
			rp({ uri: infoURL, json: true }).then(MALData => {
				this.setState({ MALData, isLoading: false })
			})
		}).catch(err => {
			console.log(err)
			this.setState({isLoading: false })
		})
	}

	stateFromMALID(malID) {
		this.setState({ isLoading: true })
		const infoURL = `http://api.jikan.moe/anime/${malID}`
		rp({ uri: infoURL, json: true }).then(MALData => {
			this.setState({ MALData, isLoading: false })
		})
	}

}