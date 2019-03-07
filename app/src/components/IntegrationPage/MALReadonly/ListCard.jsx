import React, { Component } from 'react'
import path from 'path'
import imageCache from 'image-cache'
const tempcwd = require('electron').remote.app.getPath('userData')
imageCache.setOptions({
	dir: path.join(tempcwd, '/mal-cache/'),
	compressed: false
})
import { launchInfo } from '../../../actions/actions'
import { progressPercent, statusColour, dateToSeason, dateMDYToYMD } from '../../../util/animelist'
import { MDYToTimeAgo } from '../../../util/util'

class ListCard extends Component {
	constructor(props) {
		super(props)
		this.launchInfoPage = this.launchInfoPage.bind(this)
	}

	render() {
		let { anime_image_path, anime_title, anime_media_type_string, anime_start_date_string, num_watched_episodes, anime_num_episodes, anime_airing_status } = this.props.animeData
		let finish_date_string = MDYToTimeAgo(this.props.animeData.finish_date_string) || '?'
		let score = this.props.animeData.score || '-'
		let { viewType } = this.props
		if(viewType == 'COMPACT') {
			return (
				<div className="list-card-container-compact">
					<div className="status-button" style={{background: statusColour(anime_airing_status)}}/>
					<div className="series-title" onClick={this.launchInfoPage}>{anime_title}</div>
					<div className="progress-info-container">
						<div/>
						<div className="progress-bar-container">                 
							<div className="progress-bar-progress" style={{width: progressPercent(num_watched_episodes, anime_num_episodes)+'%'}} />
						</div>
						<div/>
						<div className="progress-text">{num_watched_episodes}/{!anime_num_episodes?'?':anime_num_episodes}</div>
					</div>
					<div className="series-type series-info">{anime_media_type_string}</div>
					<div className="my-score series-info">{score}</div>
					<div className="series-season series-info">{dateToSeason(dateMDYToYMD(anime_start_date_string))}</div>
					<div className="last-updated">{finish_date_string}</div>
				</div>)
		}
		let imgfile = anime_image_path
		imageCache.fetchImages(anime_image_path).then(images => {
			imgfile = images.hashFile
		})
		if(viewType == 'ROWS') {
			return (
				<div className="list-card-container">
					<div className="bg-img" style={{ backgroundImage: `url('${imgfile}')`}}/>
					<div className="series-information-container">
						<div className="series-title" onClick={this.launchInfoPage}>{anime_title}</div>
						
						<div className="series-average series-info"></div>
						<div className="series-type series-info">{anime_media_type_string}</div>
						<div className="series-season series-info">{dateToSeason(dateMDYToYMD(anime_start_date_string))}</div>
					</div>
					<div className="my-info">
						<div className="info-label">Score: </div>
						<div className="info-editable">{score}</div>
						<div className="info-label">Progress: </div>
						<div className="progress-info-container">
							<div className="progress-bar-container">
								<div className="progress-bar-progress" style={{width: progressPercent(num_watched_episodes, anime_num_episodes) + '%'}} />
							</div>
							<div className="progress-text">{num_watched_episodes}/{!anime_num_episodes?'?':anime_num_episodes}</div>
						</div>
						<div className="info-label">Finish Date:</div>
						<div className="info-editable">{finish_date_string}</div>
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
								<div className='progress-text full'>{num_watched_episodes}/{!anime_num_episodes?'?':anime_num_episodes}</div>
							</div>
							<div className="last-updated">{finish_date_string}</div>
						</div>
						<div className="row-2">
							<div className="series-type series-info">{anime_media_type_string}</div>
							<div className="series-season series-info">{dateToSeason(dateMDYToYMD(anime_start_date_string))}</div>
							<div className="scores-dropdown">{score}</div>
						</div>
					</div>
					<div className="spacer-vertical"/>
					<div className="series-title" onClick={this.launchInfoPage}>{anime_title}</div>  
				</div>)
		}
	}


	launchInfoPage() {
		let { anime_title, anime_id } = this.props.animeData
		launchInfo(anime_title, anime_id)
	  }

}

export default ListCard