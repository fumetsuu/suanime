const fs = require('fs')
const path = require('path')
import React, { Component } from 'react'
import { convertMS } from '../../util/util.js'
import { streamMoe } from '../../util/animeDownloaders.js'
const rp = require('request-promise')

var animeDataRecent, title, link, poster, lastEp, timeago

export default class AnimeCard extends Component {
  constructor(props) {
    super(props)
    animeDataRecent = this.props.animeDataRecent
    title = animeDataRecent.anime.title
    link = `https://www.masterani.me/anime/info/${animeDataRecent.anime.slug}`
    poster = `https://cdn.masterani.me/poster/${animeDataRecent.anime.poster}`
    lastEp = animeDataRecent.episode
    var createTime = animeDataRecent['created_at'] //GMT 0
    var tzOffset = Math.abs(new Date().getTimezoneOffset())*60*1000
    timeago = convertMS(Date.now()-Date.parse(createTime)-tzOffset)
  }

  render() {
    var downloadClass = "dp-btn"
    var playClass = "none"
    var fn = `${title} - ${lastEp}`.replace(/[\\/:"*?<>|]+/, '')
    var animefilename = path.join(__dirname, `../downloads/${fn}.mp4`)
    var animeExists = fs.existsSync(animefilename) 
    if(!animeExists) {
      console.log(animefilename + ' no exist.')
      downloadClass = "dp-btn"
      playClass = "none"
    } else {
      console.log('heyyyyyy', animefilename)
      downloadClass = "none"
      playClass = "dp-btn"
    }
    return(
      <div className="card-container" onClick={this.downloadEp.bind(this)}>
        <div className="card-bg" style={{ backgroundImage: `url('${poster}')`}}></div>
        <div className={downloadClass} onClick={this.downloadEp.bind(this)}><i className="material-icons">file_download</i></div>
        <div className={playClass} onClick={this.playEp.bind(this)}><i className="material-icons">play_arrow</i></div>
        <div className="card-header">
          <div className="card-date">{timeago}</div>
          <div className="card-episode">EP. {lastEp}</div>
        </div>
        <div className="spacer-vertical"/>
        <div className="card-title">{title}</div>
      </div>
    )
  }

  downloadEp(e) {
    e.stopPropagation()    
    var epLink = `https://www.masterani.me/anime/watch/${this.props.animeDataRecent.anime.slug}/${this.props.animeDataRecent.episode}`
    var animeFilename = `${this.props.animeDataRecent.anime.title} - ${this.props.animeDataRecent.episode}.mp4`.replace(/[\\/:"*?<>|]+/, '')
    console.log(animeFilename)
    streamMoe(epLink, animeFilename)
  }

  playEp(e) {
    e.stopPropagation()
    console.log('time to play anime hehe')
  }
}
