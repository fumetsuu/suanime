import React from 'react'
import AnimeVideo from './AnimeVideo.jsx'
import WatchInformation from './WatchInformation.jsx'
import { genVideoPath, genFilename } from '../../util/util'
import store from '../../store'
import { playAnime } from '../../actions/actions'

const WatchContainer = (props) => {
	if(!props.match.params.animeName) {
		var { animeName, epNumber, posterImg } = store.getState().animeVideoReducer.videoParams
		playAnime(animeName, epNumber, posterImg)
	} else {
		var { animeName, epNumber, posterImg } = props.match.params
		store.dispatch({ type: 'PLAY_ANIME', payload: props.match.params })
	}
	var videoFile = genVideoPath(animeName, genFilename(animeName, epNumber.split('Episode ')[1]))
	return (
		<div className="watch-wrapper">
			<div className="watch-container">
				<AnimeVideo videoSrc={videoFile}/>
				<WatchInformation animeName={animeName} epNumber={epNumber} posterImg={posterImg}/>
			</div>
		</div>
	)
}

export default WatchContainer