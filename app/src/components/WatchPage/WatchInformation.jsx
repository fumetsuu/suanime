import React, { Component } from 'react'
const rp = require('request-promise')
import screenfull from 'screenfull'
import { browserLink } from '../../util/browserlink'
import { fixURL, fixFilename } from '../../util/util'
const decodeHTML = require('ent/decode')
import Dropdown from 'react-dropdown'
import { scoresData, statusData } from '../IntegrationPage/AnimeList/maldata.js'
import { connect } from 'react-redux'
import { statusToCode, typeToCode, updateScore } from '../../util/animelist.js'
import { updateAnime, launchInfo, playAnime, addAnime } from '../../actions/actions.js'
import { processExceptions } from '../InfoPage/processExceptions'

class WatchInformation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reqWidth: '100%',
            MALlink: null,
            malData: null,
            animeInfo: '',
            animeListObject: null,
            hasPrevEp: false,
            hasNextEp: false,
            loadingALO: true
        }
        this.updateScore = this.updateScore.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.launchInfoPage = this.launchInfoPage.bind(this)
        this.getMALInfo = this.getMALInfo.bind(this)
        this.checkEps = this.checkEps.bind(this)
        this.incEp = this.incEp.bind(this)
        this.addToList = this.addToList.bind(this)
    }

    componentDidMount() {
        this.checkEps()

        this.getMALInfo()

        this.fixWidths()
        
        window.addEventListener('resize', this.fixWidths)

        screenfull.on('change', () => {
            this.fixWidths()
        })
    }

    componentWillReceiveProps(nextProps) {
        this.checkEps(nextProps)
    }
    

    componentWillUnmount() {
        window.removeEventListener('resize', this.fixWidths)
        screenfull.off('change')
    }
    

    fixWidths() {
        var playerWrapper = document.getElementsByClassName('anime-player')[0]
        this.setState({
            reqWidth: playerWrapper.clientHeight*1.78 >= playerWrapper.clientWidth ? '100%' : (playerWrapper.clientHeight*1.78)+'px'
        })
    }

    render() {
        let { hasPrevEp, hasNextEp, loadingALO } = this.state
        let prevEpClass = hasPrevEp ? 'ep-btn' : 'ep-btn disabled'
        let nextEpClass = hasNextEp ? 'ep-btn' : 'ep-btn disabled'
        var malstyle = this.state.MALlink ? "anime-out-link mal-circle" : "anime-out-link mal-circle disabled"
        if(this.state.animeListObject) {
            var { my_watched_episodes, series_episodes, my_score, my_status } = this.state.animeListObject
        }
        return (
            <div className="watch-information" style={{width: this.state.reqWidth}}>
                <div className="watch-image" style={{backgroundImage: `url('${this.props.posterImg}')`}} onClick={this.launchInfoPage}/>
                <div className="watch-title-container">
                    <div className="watch-title" onClick={this.launchInfoPage}>
                        {this.props.animeName}
                        <div className="watch-episode">{this.props.epNumber}</div>
                    </div>
                    <div className={prevEpClass} onClick={this.goPrevEp.bind(this)}><i className="material-icons">chevron_left</i></div>
                    <div className={nextEpClass} onClick={this.goNextEp.bind(this)}><i className="material-icons">chevron_right</i></div>
                </div>
                {(this.props.listdata && !loadingALO)?(!this.state.animeListObject?<div className="add-to-list" onClick={this.addToList}>Add To List</div>:(
                    <div className="list-update">
                        <Dropdown className="scores-dropdown" options={scoresData} value={scoresData.find(el => el.value == my_score)} key="scores" onChange={this.updateScore}/>
                        <Dropdown className="status-dropdown" options={statusData} value={statusData.find(el => el.value == my_status)}  key="statuses" onChange={this.updateStatus}/>
                        <div className={my_watched_episodes==0?'prog-btn disabled':'prog-btn'} onClick={() => this.incEp(-1)}><i className="material-icons">remove</i></div>
                        <div className={(my_watched_episodes==series_episodes && series_episodes!=0)?'prog-btn disabled':'prog-btn'} onClick={() => this.incEp(1)}><i className="material-icons">add</i></div>
                        <div className="progress-text">{my_watched_episodes}/{series_episodes==0?'?':series_episodes}</div>
                    </div>
        )):<div className="empty"/>}    
                <div className="anime-out-link masterani-circle" onClick={() => browserLink(`https://www.masterani.me/anime/info/${this.props.slug}`)}></div>
                <div className={malstyle} onClick={() => browserLink(this.state.MALlink)}></div>
                {this.state.animeInfo}
            </div>
        )
    }
    linedList(data) {
        return data.map((el, i) => <li key={i}>{decodeHTML(el)}</li>)
    }

    nameList(data) {
        return data.map((el, i) => <span key={i}><span>{i?',  ':''}</span><span className="info-clickable" onClick={()=>browserLink(el.url)}>{decodeHTML(el.name)}</span></span>)
    }

    getAnimeListObject(id) {
        var animelist = this.props.listdata
        if(animelist) {
            return (animelist.find(anime => {
                return anime.series_animedb_id == id
            }))
        } else {
            return null
        }
    }

    addToList() {
        let { mal_id, title, status, aired, image_url, episodes, type } = this.state.malData
        var typeAsCode = typeToCode(type)
        var statusAsCode = statusToCode(status)
        var newAnimeListObject = {
            "series_animedb_id": mal_id,
            "series_title": title,
            "series_type": typeAsCode,
            "series_episodes": episodes,
            "series_status": statusAsCode,
            "series_start": aired.from,
            "series_end": aired.to,
            "series_image": image_url,
            "my_watched_episodes": 0,
            "my_start_date": "0000-00-00",
            "my_finish_date": "0000-00-00",
            "my_score": 0,
            "my_status": 6,
            "my_rewatching": 0,
            "my_rewatching_ep": 0,
            "my_last_updated": Date.now() / 1000,
            "my_tags": []
        }
        this.props.pclient.addAnime(mal_id, {
            status: 6
        })
        this.props.addAnime(mal_id, newAnimeListObject)
        this.setState({
            animeListObject: newAnimeListObject
        })
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

    launchInfoPage() {
        let { animeName, slug } = this.props
        var animeID = slug.split('-')[0]
        launchInfo(animeName, slug, animeID)
    }

    checkEps(nextProps) {
        var useprops = this.props
        if(nextProps) {
            useprops = nextProps
        }
        let { downloadsCompleted, animeName } = useprops
        let epNumber = parseInt(useprops.epNumber.split("Episode ")[1])
        var prevEp = downloadsCompleted.findIndex(el => parseInt(el.replace(".mp4", "").split(`${fixFilename(animeName)} - `)[1]) == epNumber - 1)
        if(prevEp != -1) {
            var hasPrevEp = true
        } else { var hasPrevEp = false }
        var nextEp = downloadsCompleted.findIndex(el => parseInt(el.replace(".mp4", "").split(`${fixFilename(animeName)} - `)[1]) == epNumber + 1)
        if(nextEp != -1) {
            var hasNextEp = true
        } else { var hasNextEp = false }
        this.setState({
            hasPrevEp,
            hasNextEp
        })
    }

    goPrevEp() {
        let { animeName, slug } = this.props
        let epNumber = 'Episode ' + (parseInt(this.props.epNumber.split("Episode ")[1]) - 1)
        let posterImg = this.props.posterImg.split('https://cdn.masterani.me/poster/')[1]
        playAnime(animeName, epNumber, posterImg, slug)
    }

    goNextEp() {
        let { animeName, slug } = this.props
        let epNumber = 'Episode ' + (parseInt(this.props.epNumber.split("Episode ")[1]) + 1)
        let posterImg = this.props.posterImg.split('https://cdn.masterani.me/poster/')[1]
        playAnime(animeName, epNumber, posterImg, slug)
    }

    getMALInfo() {
        var jikanBase = 'http://api.jikan.moe'
        rp({uri: `${jikanBase}/search/anime/`+fixURL(this.props.animeName), json: true }).then(data => {
            var first = processExceptions(data, this.props.animeName)
            this.setState({
                MALlink: first.url
            })
            const malid = first.mal_id
            this.setState({ animeListObject: this.getAnimeListObject(malid) })
            rp({uri: `${jikanBase}/anime/${malid}`, json: true }).then(data => {
                let seasonLink = data.premiered ? `https://myanimelist.net/anime/season/${data.premiered.split(" ")[1]}/${data.premiered.split(" ")[0]}` : 'https://myanimelist.net/anime/season'
                this.setState({
                    malData: data,
                    loadingALO: false,
                    animeInfo: 
                    <div className="anime-information">
                        <div className="tiny-header">Alt. Titles</div>
                        <div className="alt-titles">{data.title_japanese? decodeHTML(data.title_japanese):''}{data.title_english ? ', '+decodeHTML(data.title_english) : ''}{data.title_synonyms ? ', '+decodeHTML(data.title_synonyms) : ''}</div>
                        <ul className="primary-info">
                            <li>{data.score}</li>
                            <li>#{data.rank}</li>
                            <li className="info-clickable" onClick={() => browserLink(seasonLink)}>{data.premiered}</li>
                        </ul>
                        <div className="tiny-header">Synopsis</div>
                        <div className="synopsis">{decodeHTML(data.synopsis)}</div>
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
                        <table className="related-anime">
                        <tbody>
                          {this.relatedList(data.related)}
                        </tbody>
                      </table>
                    </div>
                })
            })
        })
    }

    relatedList(data) {
        let relations = Object.keys(data)
        if(!relations.length) return null
        let tablerows = []
        relations.forEach(relation => {
          tablerows.push(
            <tr key={relation}>
              <td className="data-label">{relation}</td>
              <td>{data[relation].map((el, i) => <span key={el.mal_id}>{i?', ':''}<span className={el.type=='manga'?"related-link disabled":"related-link"} onClick={() => {launchInfo(decodeHTML(el.title), null, null, el.mal_id)}}>{decodeHTML(el.title)}</span></span>)}</td>
            </tr>
          )
        })
        return tablerows
    }
}

const mapStateToProps = state => {
    return {
        pclient: state.animelistReducer.pclient,
        listdata: state.animelistReducer.listdata,
        downloadsCompleted: state.downloadsReducer.completed
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateAnime: (malID, updatedObj) => dispatch(updateAnime(malID, updatedObj)),
        addAnime: (malID, animeObj) => dispatch(addAnime(malID, animeObj))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WatchInformation)