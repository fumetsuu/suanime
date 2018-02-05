import React from 'react';
import AnimeVideo from './AnimeVideo.jsx'
import WatchInformation from './WatchInformation.jsx'
import { connect } from 'react-redux'

const WatchContainer = (props) => {
    if(!props.videoFile) {
        console.log("redirecting to home...")
        window.location.hash = "#/"
    }
    return (
    <div className="watch-container">
        <AnimeVideo videoSrc={props.videoFile}/>
        <WatchInformation animeName={props.animeName} epNumber={props.epNumber} posterImg={props.posterImg} slug={props.slug}/>
    </div>
    )
}

const mapStateToProps = state => {
    return {
        videoFile: state.animeVideoReducer.videoFile,
		animeName: state.animeVideoReducer.animeName,
        epNumber: state.animeVideoReducer.epNumber,
        posterImg: state.animeVideoReducer.posterImg,
		slug: state.animeVideoReducer.slug
    }
}

export default connect(mapStateToProps)(WatchContainer)
