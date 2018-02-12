import React, { Component } from 'react'
import InfoEpisodeCard from './InfoEpisodeCard.jsx'
const rp = require('request-promise')
import Loader from '../Loader/Loader.jsx'
export default class InfoEpisodes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      epCards: []
    }
    this.stateFromID = this.stateFromID.bind(this)
  }
  
  
  componentWillMount() {
    console.log(this.props)
    this.stateFromID(this.props.animeID)
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

  render() {
    let { isLoading, epCards } = this.state
    if(isLoading) {
      return <Loader loaderClass="central-loader"/>
    }
    return (
      <div className="info-episodes-wrapper">
        <div className="info-episodes-container">
          {epCards}
        </div>
      </div>
    )
  }
}
