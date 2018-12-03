const fs = require('fs')
const path = require('path')
const cloudscraper = require('cloudscraper')
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertMS, fixFilename, genFilename, genVideoPath } from '../../util/util.js'
import { queueDL, playAnime, launchInfo } from '../../actions/actions.js'

const imageCache = require('image-cache')
const tempcwd = require('electron').remote.app.getPath('userData')
imageCache.setOptions({
    dir: path.join(tempcwd, '/mal-cache/'),
    compressed: false
})

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
    this.animeFilename = genFilename(title, episode)    
    this.epTitle = 'Episode '+episode
    this.state = { cposter: '' }
  }

  componentWillMount() {
    //write image to cache or fetch image from case (base 64 data)
  }

  render() {
    let { title, link, poster, lastEp, timeago } = this
    var downloadClass = "dp-btn"
    var playClass = "none"
    var fn = genFilename(title, lastEp)
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
        <div className="card-bg" style={{ backgroundImage: `url('${this.poster}')`}}></div>
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
    let { slug, title, poster } = this.props.animeDataRecent.anime
    let { episode } = this.props.animeDataRecent
    let { animeFilename, epTitle } = this
    playAnime(title, epTitle, poster, slug)
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
	)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnimeCard)