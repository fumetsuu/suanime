import React, { Component } from 'react'
import InfoEpisodeCard from './InfoEpisodeCard.jsx'
const rp = require('request-promise')
import Loader from '../Loader/Loader.jsx'
import { fixURLMA, fixURL, genFilename } from '../../util/util.js'
import { connect } from 'react-redux'
import { queueDL } from '../../actions/actions';

class InfoEpisodes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      epCards: [],
      error: ''
    }
    this.stateFromID = this.stateFromID.bind(this)
    this.stateFromName = this.stateFromName.bind(this)
  }
  
  
  componentWillMount() {
    if(this.props.animeID == "null") {
      this.stateFromName(this.props.animeName)
    } else {
      this.stateFromID(this.props.animeID)
    }
  }
  
  stateFromID(id) {
    const reqURL = `https://www.masterani.me/api/anime/${id}/detailed`
    var epCards = []
    rp({ uri: reqURL, json: true }).then(data => {
      data.episodes.forEach(ep => {
        epCards.push(<InfoEpisodeCard key={ep.info.id} epData={ep.info} broadData={data.info} poster={data.poster}/>)
      })
      this.setState({
        isLoading: false,
        epCards
      })
    }).catch(err => { console.log(err) })
  }

  stateFromName(animeName) {
    const searchURL = `https://www.masterani.me/api/anime/search?search=${fixURLMA(animeName)}&sb=1`
    console.log(fixURLMA(animeName), animeName, searchURL)
    rp({ uri: searchURL, json: true }).then(searchResults => {
      let searchHit = searchResults.find(el => decodeURIComponent(fixURL(el.title)) == decodeURIComponent(animeName))
      if(!searchHit) {
        this.setState({
          isLoading: false,
          epCards: null,
          error: 'No Episodes Found'
        })
        return false
      }
      let id = searchHit.id
     this.stateFromID(id)
    }).catch(err => console.log(err))
  }

  render() {
    let { isLoading, epCards } = this.state
    if(isLoading) {
      return <Loader loaderClass="central-loader"/>
    }
    return (
      <div className="info-episodes-wrapper">
        <div className="info-episodes-container">
          {epCards?
            <div className="download-all" onClick={this.downloadAll.bind(this)}>Download All Episodes</div>
            :null}
          {epCards?epCards:<div className="noeps">{this.state.error}</div>}
        </div>
      </div>
    )
  }

  downloadAll() {
    let { epCards } = this.state
    epCards.forEach(el => {
      let { poster } = el.props
      let { title, slug } = el.props.broadData
      let { episode } = el.props.epData
      var epLink = `https://www.masterani.me/anime/watch/${slug}/${episode}`
      var animeFilename = genFilename(title, episode)
      var posterImg = `https://cdn.masterani.me/poster/${poster}`
      var epTitle = 'Episode '+episode
      this.props.queueDL(epLink, animeFilename, posterImg, title, epTitle)
    })
  }
}

const mapDispatchToProps = dispatch => {
  return {
    queueDL: (epLink, animeFilename, posterImg, animeName, epTitle) => dispatch(queueDL(epLink, animeFilename, posterImg, animeName, epTitle))
  }
}

export default connect(null, mapDispatchToProps)(InfoEpisodes)