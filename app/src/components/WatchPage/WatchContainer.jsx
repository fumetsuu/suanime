import React from 'react';
import AnimeVideo from './AnimeVideo.jsx'
import { connect } from 'react-redux'

const WatchContainer = (props) => {
    console.log(props)
    return (
    <div className="watch-container">
        <AnimeVideo videoSrc={props.videoFile}/>
        <div className="watch-information">
            <div className="watch-title">{props.animeName} 
                <br></br> 
                <div className="watch-episode">{props.epNumber}</div>
            </div>
        </div>
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
