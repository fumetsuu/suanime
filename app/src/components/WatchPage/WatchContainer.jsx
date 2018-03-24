import React from 'react';
import AnimeVideo from './AnimeVideo.jsx'
import WatchInformation from './WatchInformation.jsx'
import { genVideoPath, genFilename } from '../../util/util'
import store from '../../store.js'
import { playAnime } from '../../actions/actions';

const WatchContainer = (props) => {
    if(!props.match.params.animeName) {
        var { animeName, epNumber, posterImg, slug } = store.getState().animeVideoReducer.videoParams
        playAnime(animeName, epNumber, posterImg, slug)
    } else {
        var { animeName, epNumber, posterImg, slug } = props.match.params
        store.dispatch({ type: 'PLAY_ANIME', payload: props.match.params })
    }
    var videoFile = genVideoPath(animeName, genFilename(animeName, epNumber.split("Episode ")[1]))
    var posterLink = `https://cdn.masterani.me/poster/${posterImg}`
    return (
        <div className="watch-wrapper">
            <div className="watch-container">
                <AnimeVideo videoSrc={videoFile}/>
                <WatchInformation animeName={animeName} epNumber={epNumber} posterImg={posterLink} slug={slug}/>
            </div>
        </div>
    )
}

export default WatchContainer