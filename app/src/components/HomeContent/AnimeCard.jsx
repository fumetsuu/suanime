import React, { Component } from 'react'
import { convertMS } from '../../util.js'

var content

export default class AnimeCard extends Component {
  constructor(props) {
    super(props)
    var animeDataRecent = this.props.animeDataRecent
    var title = animeDataRecent.anime.title
    var link = `https://www.masterani.me/anime/info/${animeDataRecent.anime.slug}`
    var poster = `https://cdn.masterani.me/poster/${animeDataRecent.anime.poster}`
    var lastEp = animeDataRecent.episode
    var createTime = animeDataRecent['created_at'] //GMT 0
    var tzOffset = Math.abs(new Date().getTimezoneOffset())*60*1000
    var timeago = convertMS(Date.now()-Date.parse(createTime)-tzOffset)
    content = 
        <a className="card-container" href={link}>
          <div className="card-bg" style={{ backgroundImage: `url('${poster}')`}}></div>
          <div className="card-header">
            <div className="card-date">{timeago}</div>
            <div className="card-episode">EP. {lastEp}</div>
          </div>
          <div className="spacer-vertical"/>
          <div className="card-title">{title}</div>
        </a>
  }

  render() {
    return content
  }
}
