import React, { Component } from 'react'
const path = require('path')
import { queueDL, playAnime } from '../../actions/actions.js'
import { connect } from 'react-redux'

class InfoEpisodeCard extends Component {
    constructor(props) {
        super(props)
        this.queueDLComp = this.queueDLComp.bind(this)
        this.playEpComp = this.playEpComp.bind(this)
    }
    
    render() {
        let { episode, title, aired } = this.props.epData
        let broadTitle = this.props.broadData.title
        let { downloading, completed } = this.props

        var downloadClass = "dp-btn"
        var playClass = "none"
        var fn = `${broadTitle} - ${episode}`.replace(/[\\/:"*?<>|]+/, '')+'.mp4'
        if(downloading.includes(fn)) {
          downloadClass = "none"
          playClass = "dp-btn disabled"
        } else if(completed.includes(fn)) {
          downloadClass = "none"
          playClass = "dp-btn"
        } else {
          downloadClass = "dp-btn"
          playClass = "none"
        }

        return (
            <div className="info-episode-card">
                <div className="side-flair"/>
                <div className="ep-number">EP. {episode}</div>
                <div className="ep-title">{title?title:broadTitle+' - Episode '+episode}</div>
                <div className="ep-date">{aired}</div>
                <div className={downloadClass} onClick={this.queueDLComp}><i className="material-icons">file_download</i></div>
                <div className={playClass} onClick={this.playEpComp}><i className="material-icons">play_arrow</i></div>
            </div>
        )
    }

    queueDLComp(e) {
        e.stopPropagation()   
        let { slug, title } = this.props.broadData 
        let { episode } = this.props.epData
        var epLink = `https://www.masterani.me/anime/watch/${slug}/${episode}`
        var animeName = title
        var epTitle = 'Episode '+episode
        var animeFilename = `${title} - ${episode}.mp4`.replace(/[\\/:"*?<>|]+/, '')
        var posterImg = `https://cdn.masterani.me/poster/${this.props.poster}`
        this.props.queueDL(epLink, animeFilename, posterImg, animeName, epTitle)
      }
    
      playEpComp(e) {
        e.stopPropagation()
        let { slug, title } = this.props.broadData 
        let { episode } = this.props.epData
        var epLink = `https://www.masterani.me/anime/watch/${slug}/${episode}`
        var animeName = title
        var epNumber = 'Episode '+episode
        var animeFilename = `${title} - ${episode}.mp4`.replace(/[\\/:"*?<>|]+/, '')
        var posterImg = `https://cdn.masterani.me/poster/${this.props.poster}`
        var videoFile = path.join(global.estore.get('downloadsPath'), animeFilename)
        this.props.playAnime(videoFile, animeName, epNumber, posterImg, slug)
        window.location.hash="#/watch"
      }
}

const mapStateToProps = state => {
    return {
      downloading: state.downloadsReducer.downloading,
      completed: state.downloadsReducer.completed
    }
}

const mapDispatchToProps = dispatch => { //create actions.js ! this is repeated from AnimeCard.jsx
    return {
      queueDL: (epLink, animeFilename, posterImg, animeName, epTitle) => dispatch(
		queueDL(epLink, animeFilename, posterImg, animeName, epTitle)
	  ),
      playAnime: (videoFile, animeName, epNumber, posterImg, slug) => dispatch(
		playAnime(videoFile, animeName, epNumber, posterImg, slug)
	  )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoEpisodeCard)