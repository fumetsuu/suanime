import React, { Component } from 'react';
const rp = require('request-promise')
import screenfull from 'screenfull'
import { browserLink } from '../../util/browserlink';
import { fixURL } from '../../util/util';
const h2p = require('html2plaintext')
import Dropdown from 'react-dropdown'
import { scoresData, statusData } from '../IntegrationPage/AnimeList/maldata.js'
import { connect } from 'react-redux'
import { updateAnime } from '../../actions/actions.js'

class WatchInformation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reqWidth: '100%',
            MALlink: null,
            animeInfo: '',
            animeListObject: null
        }
        this.updateScore = this.updateScore.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.incEp = this.incEp.bind(this)
    }

    componentDidMount() {
        var jikanBase = 'http://api.jikan.me'
        rp({uri: `${jikanBase}/search/anime/`+fixURL(this.props.animeName), json: true }).then(data => {
            var first = data.result.find(el => el.title == this.props.animeName) || data.result[1]  //this relies on the name being consistent between MAL and Masterani databases, if they aren't consistent, takes the SECOND result to try and compensate
            this.setState({
                MALlink: first.url
            })
            const malid = first.id
            this.setState({ animeListObject: this.getAnimeListObject(malid) })
            rp({uri: `${jikanBase}/anime/${malid}`, json: true }).then(data => {
                let seasonLink = data.premiered ? `https://myanimelist.net/anime/season/${data.premiered.split(" ")[1]}/${data.premiered.split(" ")[0]}` : 'https://myanimelist.net/anime/season'
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
                {!this.state.animeListObject?null:(
                    <div className="list-update">
                        <Dropdown className="scores-dropdown" options={scoresData} value={scoresData.find(el => el.value == this.state.animeListObject.my_score)} key="scores" onChange={this.updateScore}/>
                        <Dropdown className="status-dropdown" options={statusData} value={statusData.find(el => el.value == this.state.animeListObject.my_status)}  key="statuses" onChange={this.updateStatus}/>
                        <div className="prog-btn" onClick={() => this.incEp(-1)}><i className="material-icons">remove</i></div>
                        <div className="prog-btn" onClick={() => this.incEp(1)}><i className="material-icons">add</i></div>
                        <div className="progress-text">{this.state.animeListObject.my_watched_episodes}/{this.state.animeListObject.series_episodes==0?'?':this.state.animeListObject.series_episodes}</div>
                    </div>
        )}    
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

    getAnimeListObject(id) {
        var animelist = this.props.listdata
        return (animelist.find(anime => {
            return anime.series_animedb_id == id
        }))
    }

    updateScore(selected) {
        var newScore = selected.value
        let { series_animedb_id } = this.state.animeListObject
        this.props.pclient.updateAnime(series_animedb_id, {
            score: newScore
        })
        var updatedObj = {
            my_score: newScore
        }
        this.setState({
            animeListObject: Object.assign({}, this.state.animeListObject, {
                my_score: newScore
            })
        })
        this.props.updateAnime(series_animedb_id, updatedObj)
    }

    updateStatus(selected) {
        var newStatus = selected.value
        let { series_animedb_id } = this.state.animeListObject
        this.props.pclient.updateAnime(series_animedb_id, {
            status: newStatus
        })
        var updatedObj = {
            my_status: newStatus
        }
        this.setState({
            animeListObject: Object.assign({}, this.state.animeListObject, {
                my_status: newStatus
            })
        })
        this.props.updateAnime(series_animedb_id, updatedObj)
    }

    incEp(inc) {
        let { series_animedb_id, my_watched_episodes } = this.state.animeListObject
        if(my_watched_episodes != 0 && my_watched_episodes != series_animedb_id) {
            this.props.pclient.updateAnime(series_animedb_id, {
                episode: my_watched_episodes+inc
            })
        }
        var updatedObj = {
            my_watched_episodes: my_watched_episodes+inc
        }
        this.setState({
            animeListObject: Object.assign({}, this.state.animeListObject, {
                my_watched_episodes: my_watched_episodes+inc
            })
        })
        this.props.updateAnime(series_animedb_id, updatedObj)
    }
}

const mapStateToProps = state => {
    return {
        pclient: state.animelistReducer.pclient,
        listdata: state.animelistReducer.listdata
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateAnime: (malID, updatedObj) => dispatch(updateAnime(malID, updatedObj))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WatchInformation)