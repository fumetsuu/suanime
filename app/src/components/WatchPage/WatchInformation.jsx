import React, { Component } from 'react';
const rp = require('request-promise')
import screenfull from 'screenfull'
import { browserLink } from '../../util/browserlink';
import { fixURL } from '../../util/util';
const h2p = require('html2plaintext')
import Dropdown from 'react-dropdown'
import { scoresData, statusData } from '../IntegrationPage/AnimeList/maldata.js'

export default class WatchInformation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reqWidth: '100%',
            MALlink: null,
            animeInfo: ''
        }
    }

    componentDidMount() {
        var jikanBase = 'http://api.jikan.me'
        rp(`${jikanBase}/search/anime/`+fixURL(this.props.animeName)).then(data => {
            var first = JSON.parse(data).result[0]
            this.setState({
                MALlink: first.url
            })
            const malid = first.id
            rp(`${jikanBase}/anime/${malid}`).then(data => {
                data = JSON.parse(data)
                let seasonLink = `https://myanimelist.net/anime/season/${data.premiered.split(" ")[1]}/${data.premiered.split(" ")[0]}`
                this.setState({
                    animeInfo: 
                    <div className="anime-information">
                        <div className="tiny-header">Alt. Titles</div>
                        <div className="alt-titles">{data.title_japanese? h2p(data.title_japanese):''}{data.title_english ? ', '+h2p(data.title_english) : ''}{data.title_synonyms ? ', '+h2p(data.title_synonyms) : ''}</div>
                        <ul className="primary-info">
                            <li>{data.score}</li>
                            <li>#{data.rank}</li>
                            <li className="info-clickable" onClick={() => browserLink(seasonLink)}>{data.premiered}</li>
                        </ul>
                        <div className="tiny-header">Synopsis</div>
                        <div className="synopsis">{h2p(data.synopsis)}</div>
                        <table className="secondary-info">
                            <tbody>
                                <tr>
                                    <td>Status:</td>
                                    <td>{data.status}</td>
                                </tr>
                                <tr>
                                    <td>Type:</td>
                                    <td>{data.type}</td>
                                </tr>
                                <tr>
                                    <td>Episodes:</td>
                                    <td>{data.episodes}</td>
                                </tr>
                                <tr>
                                    <td>Duration:</td>
                                    <td>{data.duration}</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Source:</td>
                                    <td>{data.source}</td>
                                </tr>
                                <tr>
                                    <td>Producer(s):</td>
                                    <td>{this.nameList(data.producer)}</td>
                                </tr>
                                <tr>
                                    <td>Studio(s):</td>
                                    <td>{this.nameList(data.studio)}</td>
                                </tr>
                                <tr>
                                    <td>Broadcast:</td>
                                    <td>{data.broadcast}</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Favourites:</td>
                                    <td>{data.favorites}</td>
                                </tr>
                                <tr>
                                    <td>Popularity:</td>
                                    <td>#{data.popularity}</td>
                                </tr>
                                <tr>
                                    <td>Members:</td>
                                    <td>{data.members}</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Genres:</td>
                                    <td>{this.nameList(data.genre)}</td>
                                </tr>
                                <tr>
                                    <td>Openings:</td>
                                    <td>{this.linedList(data.opening_theme)}</td>
                                </tr>
                                <tr>
                                    <td>Endings:</td>
                                    <td>{this.linedList(data.ending_theme)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                })
            })
        })
        this.fixWidths()
        window.addEventListener('resize', () => {
            this.fixWidths()
        })

        screenfull.on('change', () => {
            this.fixWidths()
        })
    }

    fixWidths() {
        var playerWrapper = document.getElementsByClassName('anime-player')[0]
        this.setState({
            reqWidth: playerWrapper.clientHeight*1.78 >= playerWrapper.clientWidth ? '100%' : (playerWrapper.clientHeight*1.78)+'px'
        })
    }

    render() {
        var malstyle = this.state.MALlink ? "anime-out-link mal-circle" : "anime-out-link mal-circle disabled"
        return (
            <div className="watch-information" style={{width: this.state.reqWidth}}>
                <div className="watch-image" style={{backgroundImage: `url('${this.props.posterImg}')`}}/>
                <div className="watch-title">{this.props.animeName} 
                    <br></br> 
                    <div className="watch-episode">{this.props.epNumber}</div>
                </div>
                <div className="list-update">
                    <Dropdown className="scores-dropdown" value={'10'} options={scoresData} key="scores"/>
                    <Dropdown className="status-dropdown" value={'Currently Watching'} options={statusData}  key="statuses"/>
                    <div className="prog-btn"><i className="material-icons">remove</i></div>
                    <div className="prog-btn"><i className="material-icons">add</i></div>
                </div>
                <div className="anime-out-link masterani-circle" onClick={() => browserLink(`https://www.masterani.me/anime/info/${this.props.slug}`)}></div>
                <div className={malstyle} onClick={() => browserLink(this.state.MALlink)}></div>
                {this.state.animeInfo}
            </div>
        )
    }
    linedList(data) {
        return data.map((el, i) => <li key={i}>{h2p(el)}</li>)
    }

    nameList(data) {
        return data.map((el, i) => <span key={i}><span>{i?',  ':''}</span><span className="info-clickable" onClick={()=>browserLink(el.url)}>{h2p(el.name)}</span></span>)
    }
}
