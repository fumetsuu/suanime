import React, { Component } from 'react'
const h2p = require('html2plaintext')
import { browserLink } from '../../util/browserlink';
export default class InfoMain extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    let { score, rank, premiered, image_url, type, episodes, status, broadcast, studio, source, duration, rating, synopsis, genre } = this.props.MALData
    return (
      <div className="info-main">
        <div className="primary-stats">
          <div className="primary-stat">{score}</div> <div className="vertical-blue"/> <div className="primary-stat">#{rank}</div> <div className="vertical-blue"/> <div className="primary-stat">{premiered}</div>
        </div>
        <div className="secondary-stats-container">
          <div className="anime-image" style={{backgroundImage: `url('${image_url}')`}}/>
          <table className="secondary-stats">
            <tbody>
            <tr>
                <td className="data-label">Type:</td>
                <td>{type}</td>
            </tr>
            <tr>
                <td className="data-label">Episodes:</td>
                <td>{episodes}</td>
            </tr>
            <tr>
                <td className="data-label">Status:</td>
                <td>{status}</td>
            </tr>
            <tr>
                <td className="data-label">Broadcast:</td>
                <td>{broadcast}</td>
            </tr>
            <tr>
              <td className="data-label">Studios:</td>
              <td>{studio[0].name}</td>
            </tr>
            <tr>
              <td className="data-label">Source:</td>
              <td>{source}</td>
            </tr>
            <tr>
              <td className="data-label">Duration:</td>
              <td>{duration}</td>
            </tr>
            <tr>
              <td className="data-label">Rating:</td>
              <td>{rating}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <div className="synopsis-main">
          {h2p(synopsis)}
        </div>
        <ul className="genres">
          {this.nameList(genre)}
        </ul>
      </div>
    )
  }

  nameList(data) {
    return data.map((el, i) => <span key={i}>{i?<div className="vertical-blue"/>:null}<span className="info-clickable" onClick={()=>browserLink(el.url)}>{h2p(el.name)}</span></span>)
  }
}
