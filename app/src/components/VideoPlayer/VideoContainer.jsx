import fs from 'fs'
const { dialog } = require('electron').remote
import React, { Component } from 'react'
import AnimeVideo from '../WatchPage/AnimeVideo.jsx'

class VideoContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			searchValue: window.vidplayerfile || '',
			videoFile: window.vidplayerfile || '',
			badFile: false
		}
	}

	render() {
		let { searchValue, videoFile, badFile } = this.state
		return (
			<div className="watch-wrapper">
				<div className="watch-container">
					<AnimeVideo videoSrc={videoFile}/>
					<form className="search-bar-container">
						<input type="text" className={'search-bar' + (badFile ? ' search-invalid' : '')} placeholder="Video File" onChange={this.handleSearchChange.bind(this)} value={searchValue}/>
						<button onClick={this.findVideoFile.bind(this)} className="search-bar-button"><i className="material-icons">folder_open</i></button>
						<button onClick={this.checkVideoFile.bind(this)} className="search-bar-button"><i className="material-icons">play_circle_filled</i></button>
					</form>
				</div>
			</div>
		)
	}

	handleSearchChange(e) {
		this.setState({ searchValue: e.target.value })
	}

	findVideoFile() {
		dialog.showOpenDialog({
			filters: [{ name: 'Videos', extensions: ['mkv', 'avi', 'mp4', 'mov'] }],
			properties: ['openFile'],
			defaultPath: global.estore.get('downloadsPath') }, vidPath => {
			if(vidPath) {
				window.vidplayerfile = vidPath[0]
				this.setState({ badFile: false, searchValue: vidPath[0], videoFile: vidPath[0] })
			}
		})
	}

	checkVideoFile(e) {
		e.preventDefault()
		e.stopPropagation()
		let { searchValue } = this.state
		if(fs.existsSync(searchValue)) {
			window.vidplayerfile = searchValue
			this.setState({ badFile: false, videoFile: searchValue })
		} else {
			this.setState({ badFile: true })
		}
	}

}

export default VideoContainer