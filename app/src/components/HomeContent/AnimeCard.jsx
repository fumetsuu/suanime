const fs = require('fs')
const path = require('path')
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertMS } from '../../util/util.js'
const rp = require('request-promise')

let content

class AnimeCard extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    var animeDataRecent = this.props.animeDataRecent
    var title = animeDataRecent.anime.title
    var link = `https://www.masterani.me/anime/info/${animeDataRecent.anime.slug}`
    var poster = `https://cdn.masterani.me/poster/${animeDataRecent.anime.poster}`
    var lastEp = animeDataRecent.episode
    var createTime = animeDataRecent['created_at'] //GMT 0
    var tzOffset = Math.abs(new Date().getTimezoneOffset())*60*1000
    var timeago = convertMS(Date.now()-Date.parse(createTime)-tzOffset)
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
    content = 
      <div className="card-container">
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
    return content
  }

  queueDLComp(e) {
    e.stopPropagation()    
    var epLink = `https://www.masterani.me/anime/watch/${this.props.animeDataRecent.anime.slug}/${this.props.animeDataRecent.episode}`
    var animeName = this.props.animeDataRecent.anime.title
    var epTitle = 'Episode '+this.props.animeDataRecent.episode
    var animeFilename = `${animeName} - ${this.props.animeDataRecent.episode}.mp4`.replace(/[\\/:"*?<>|]+/, '')
    var posterImg = `https://cdn.masterani.me/poster/${this.props.animeDataRecent.anime.poster}`
    this.props.queueDL(epLink, animeFilename, posterImg, animeName, epTitle)
  }

  playEpComp(e) {
    e.stopPropagation()
    var animeName = this.props.animeDataRecent.anime.title
    var animeFilename = `${animeName} - ${this.props.animeDataRecent.episode}.mp4`.replace(/[\\/:"*?<>|]+/, '')
    var videoFile = path.join(__dirname, ('../downloads/'+animeFilename))
    var epNumber = 'Episode '+this.props.animeDataRecent.episode
    var posterImg = `https://cdn.masterani.me/poster/${this.props.animeDataRecent.anime.poster}`
    var slug = this.props.animeDataRecent.anime.slug
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

const mapDispatchToProps = dispatch => {
  return {
    queueDL: (epLink, animeFilename, posterImg, animeName, epTitle) => dispatch({
      type: 'QUEUE_DOWNLOAD',
      payload: {
        epLink: epLink,
        animeFilename: animeFilename,
        posterImg: posterImg,
        animeName: animeName,
        epTitle: epTitle
      }
    }),
    playAnime: (videoFile, animeName, epNumber, posterImg, slug) => dispatch({
      type: 'PLAY_ANIME',
      payload: {
        videoFile: videoFile,
        animeName: animeName,
        epNumber: epNumber,
        posterImg: posterImg,
        slug: slug
      }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnimeCard)