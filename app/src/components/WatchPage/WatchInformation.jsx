import React, { Component } from 'react';
const rp = require('request-promise')
import screenfull from 'screenfull'
const h2p = require('html2plaintext')

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
        rp(`${jikanBase}/search/anime/`+this.props.animeName.replace(/\s+/g, "_")).then(data => {
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
                        <div className="alt-titles">{data.title_japanese? data.title_japanese:''}{data.title_english ? ', '+data.title_english : ''}{data.title_synonyms ? ', '+data.title_synonyms : ''}</div>
                        <ul className="primary-info">
                            <li>{data.score}</li>
                            <li>#{data.rank}</li>
                            <li className="info-clickable" onClick={() => this.browserLink(seasonLink)}>{data.premiered}</li>
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
                                    <td>{data.popularity}</td>
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
                <div className="spacer-horizontal"/>
                <div className="anime-out-link masterani-circle" onClick={() => this.browserLink(`https://www.masterani.me/anime/info/${this.props.slug}`)}></div>
                <div className={malstyle} onClick={() => this.browserLink(this.state.MALlink)}></div>
                {this.state.animeInfo}
            </div>
        )
    }

    browserLink(url) { //this is opening even without having to click
        require('electron').shell.openExternal(url)        
    }

    linedList(data) {
        return data.map(el => <li>{el}</li>)
    }

    nameList(data) {
        return data.map((el, i) => <span><span>{i?',  ':''}</span><span className="info-clickable" onClick={()=>this.browserLink(el.url)}>{el.name}</span></span>)
    }
}
