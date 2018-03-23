import React from 'react';
import AnimeVideo from './AnimeVideo.jsx'
import WatchInformation from './WatchInformation.jsx'
import { genVideoPath, genFilename } from '../../util/util';

const WatchContainer = (props) => {
    console.log(props)
    let { animeName, epNumber, posterImg, slug } = props.match.params
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