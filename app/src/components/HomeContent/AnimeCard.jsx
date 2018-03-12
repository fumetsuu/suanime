const fs = require('fs')
const path = require('path')
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertMS } from '../../util/util.js'
import { queueDL, playAnime, launchInfo } from '../../actions/actions.js'
const rp = require('request-promise')

class AnimeCard extends Component {
  constructor(props) {
    super(props)
    let { title, slug, poster } = this.props.animeDataRecent.anime
    let { episode, created_at } = this.props.animeDataRecent
    this.title = title
    this.link = `https://www.masterani.me/anime/info/${slug}`
    this.poster = `https://cdn.masterani.me/poster/${poster}`
    this.epLink = `https://www.masterani.me/anime/watch/${slug}/${episode}`
    this.lastEp = episode
    var tzOffset = Math.abs(new Date().getTimezoneOffset())*60*1000
    this.timeago = convertMS(Date.now()-Date.parse(created_at)-tzOffset)
    this.animeFilename = `${title} - ${episode}.mp4`.replace(/[\\/:"*?<>|]+/, '')    
    this.epTitle = 'Episode '+episode
  }

  render() {
    let { title, link, poster, lastEp, timeago } = this
    var downloadClass = "dp-btn"
    var playClass = "none"
    var fn = `${title} - ${lastEp}`.replace(/[\\/:"*?<>|]+/, '')+'.mp4'
    if(this.props.downloading.includes(fn)) {
      downloadClass = "none"
      playClass = "dp-btn disabled"
    } else if(this.props.completed.includes(fn)) {
      downloadClass = "none"
      playClass = "dp-btn"
    } else {
      downloadClass = "dp-btn"
      playClass = "none"
    }
    this.content = 
      <div className="card-container" onClick={this.launchInfoPage.bind(this)}>
        <div className="card-bg" style={{ backgroundImage: `url('${poster}')`}}></div>
        <div className={downloadClass} onClick={this.queueDLComp.bind(this)}><i className="material-icons">file_download</i></div>
        <div className={playClass} onClick={this.playEpComp.bind(this)}><i className="material-icons">play_arrow</i></div>
        <div className="card-header">
          <div className="card-date">{timeago}</div>
          <div className="card-episode">EP. {lastEp}</div>
        </div>
        <div className="spacer-vertical"/>
        <div className="card-title">{title}</div>
    </div>
    return this.content
  }

  queueDLComp(e) {
    e.stopPropagation()
    let { title, epLink, poster, lastEp, animeFilename, epTitle } = this
    let { episode } = this.props.animeDataRecent
    this.props.queueDL(epLink, animeFilename, poster, title, epTitle)
  }

  playEpComp(e) {
    e.stopPropagation()
    let { slug, title } = this.props.animeDataRecent.anime
    let { episode } = this.props.animeDataRecent
    let { animeFilename, epTitle, poster } = this
    var videoFile = path.join(global.estore.get('downloadsPath'), animeFilename)
    this.props.playAnime(videoFile, title, epTitle, poster, slug)
    window.location.hash="#/watch"
  }

  launchInfoPage() {
    let { title, slug, id } = this.props.animeDataRecent.anime
    launchInfo(title, slug, id, null)
  }
}

const mapStateToProps = state => {
  return {
    downloading: state.downloadsReducer.downloading,
    completed: state.downloadsReducer.completed
  }
}

const mapDispatchToProps = dispatch => {
  return {
    queueDL: (epLink, animeFilename, posterImg, animeName, epTitle) => dispatch(
		queueDL(epLink, animeFilename, posterImg, animeName, epTitle)
	),
    playAnime: (videoFile, animeName, epNumber, posterImg, slug) => dispatch(
		playAnime(videoFile, animeName, epNumber, posterImg, slug)
	)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnimeCard)