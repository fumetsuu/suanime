import React, { Component } from 'react'
import { launchInfo } from '../../actions/actions.js'
import { loadMAImage } from '../../util/maImageLoader.js';

export default class ResultCard extends Component {
	constructor(props) {
		super(props)   
		this.launchInfoPage = this.launchInfoPage.bind(this)
		this.state = { cposter: '' }
	}

	componentWillMount() {
		let { poster } = this.props.animeData
		const posterURL = `https://cdn.masterani.me/poster/${poster.file}`
		loadMAImage(posterURL).then(imgData => {
			this.setState({ cposter: imgData })
		}).catch(console.log)
	}
	
	render() {
		let { title } = this.props.animeData

		return (
			<div className="result-card-container" onClick={this.launchInfoPage}>
				<div className="bg-img" style={{backgroundImage: `url('data:image/jpeg;base64,${this.state.cposter}')`}}/>
				<div className="title">{title}</div>
			</div>
		)
	}

	launchInfoPage() {
		let { title, id, slug } = this.props.animeData     
		var animeName = title
		var animeID = id
		console.log(title)
		launchInfo(animeName, slug, animeID, null)
	  }
	  
}
