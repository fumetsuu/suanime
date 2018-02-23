import React, { Component } from 'react'
const path = require('path')
import { convertMS } from '../../../util/util.js'
const imageCache = require('image-cache')
imageCache.setOptions({
    dir: path.join(__dirname, '../mal-cache/'),
    compressed: false
})
import { connect } from 'react-redux'
import { updateAnime, launchInfo } from '../../../actions/actions.js'
import DropRight from './DropRight.jsx'
import Dropdown from 'react-dropdown'
import { scoresData, statusData } from './maldata.js'
class ListCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lastUpdated: makeLastUpdated(props.animeData.my_last_updated)
        }
        this.updateEp = this.updateEp.bind(this)
        this.incEp = this.incEp.bind(this)
        this.updateScore = this.updateScore.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.launchInfoPage = this.launchInfoPage.bind(this)
        this.pclient = props.pclient
    }
    
    // {!completedseries?<div className="progress-bar-aired" style={{width: guessAired(series_start, series_episodes)+'%'}} />:null}   

    render() {
        let { series_image, series_title, series_type, series_start, my_status, my_score, my_watched_episodes, series_episodes, series_status } = this.props.animeData
        let { viewType } = this.props
        let { lastUpdated } = this.state
        let completedseries = my_watched_episodes >= series_episodes && series_episodes!=0
        if(viewType == 'COMPACT') {
            return (
            <div className="list-card-container-compact">
                <div className="status-button" style={{background: statusColour(series_status)}}/>
                <div className="series-title" onClick={this.launchInfoPage}>{series_title}</div>
                <div className="progress-info-container">
                    {!completedseries ? <div className="prog-btn" onClick={() => {this.incEp(-1)}}><i className="material-icons">remove</i></div> : <div/>}
                    <div className="progress-bar-container">                 
                        <div className="progress-bar-progress" style={{width: progressPercent(my_watched_episodes, series_episodes)+'%'}} />
                    </div>
                        {!completedseries ? <div className="prog-btn" onClick={() => {this.incEp(1)}}><i className="material-icons">add</i></div> : <div/>}
                        <div className="progress-text">{my_watched_episodes}/{!series_episodes?'?':series_episodes}</div>
                </div>
                <Dropdown className="scores-dropdown" value={scoresData.find(el => el.value == my_score)} options={scoresData} onChange={this.updateScore} key="scores"/>
                <Dropdown className="status-dropdown" value={statusData.find(el => el.value == my_status)} options={statusData} onChange={this.updateStatus} key="statuses"/>
                <div className="series-type series-info">{typeCodeToText(series_type)}</div>
                <div className="series-season series-info">{dateToSeason(series_start)}</div>
                <div className="last-updated">{lastUpdated}</div>
            </div>)
        }
        let imgfile = series_image
        imageCache.fetchImages(series_image).then(images => {
            imgfile = images.hashFile
        })
        if(viewType == 'ROWS') {
            return (
            <div className="list-card-container">
                <div className="bg-img" style={{ backgroundImage: `url('${imgfile}')`}}/>
                <div className="series-information-container">
                    <div className="series-title" onClick={this.launchInfoPage}>{series_title}</div>
                    
                    <div className="series-average series-info"></div>
                    <div className="series-type series-info">Type: {typeCodeToText(series_type)}</div>
                    <div className="series-season series-info">{dateToSeason(series_start)}</div>
                </div>
                <div className="my-info">
                    <div className="last-updated">Last updated: {lastUpdated}</div>
                    <div className="info-label">Status: </div>
                    <DropRight value={statusData.find(el => el.value == my_status)} options={statusData} onChange={this.updateStatus} key="statuses" className="status-select"/>
                    <div className="info-label">Score: </div>
                    <DropRight value={scoresData.find(el => el.value == my_score)} options={scoresData} onChange={this.updateScore} key="scores"/>
                    <div className="info-label">Progress: </div>
                    <div className="progress-info-container">
                        <div className="progress-bar-container">
                            <div className="progress-bar-progress" style={{width: progressPercent(my_watched_episodes, series_episodes)+'%'}} />
                        </div>
                        {!completedseries ? <div className="prog-btn" onClick={() => {this.incEp(-1)}}><i className="material-icons">remove</i></div> : <div/>}
                        {!completedseries ? <div className="prog-btn" onClick={() => {this.incEp(1)}}><i className="material-icons">add</i></div> : <div/>}
                        <div className="progress-text">{my_watched_episodes}/{!series_episodes?'?':series_episodes}</div>
                    </div>
                </div>
            </div>)
        }
        if(viewType == 'CARDS') {
            return (
                <div className="list-card-container-card">
                    <div className="bg-img" style={{ backgroundImage: `url('${imgfile}')`}}/>
                    <div className="series-information-container">
                        <div className="row-1">
                            <div className="progress-container">
                                <div className={!completedseries?"progress-text":"progress-text full"}>{my_watched_episodes}/{!series_episodes?'?':series_episodes}</div>
                                {!completedseries ? <div className={"prog-btn"+my_watched_episodes==0?' disabled':''} onClick={() => {this.incEp(-1)}}><i className="material-icons">remove</i></div> : <div/>}
                                {!completedseries ? <div className={"prog-btn"+my_watched_episodes==series_episodes?' disabled':''} onClick={() => {this.incEp(1)}}><i className="material-icons">add</i></div> : <div/>}
                            </div>
                            <div className="last-updated">{lastUpdated}</div>
                        </div>
                        <div className="row-2">
                            <div className="series-type series-info">{typeCodeToText(series_type)}</div>
                            <div className="series-season series-info">{dateToSeason(series_start)}</div>
                            <Dropdown value={scoresData.find(el => el.value == my_score)} options={scoresData} onChange={this.updateScore} key="scores" className="scores-dropdown"/>
                        </div>
                    </div>
                    <div className="spacer-vertical"/>
                    <div className="series-title" onClick={this.launchInfoPage}>{series_title}</div>                    
                </div>)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            lastUpdated: makeLastUpdated(nextProps.animeData.my_last_updated)
        })
    }

    componentDidMount() {
        var updateInterval = calcUpdateInterval(this.props.animeData.my_last_updated)
        this.lastUpdatedTimer = updateInterval ? setInterval(() => {
            this.setState({
                lastUpdated: makeLastUpdated(this.props.animeData.my_last_updated)
            })
        }, updateInterval) : null
    }
    

    componentWillUnmount() {
        if(this.lastUpdatedTimer) {
            window.clearInterval(this.lastUpdatedTimer)
        }
    }

    updateScore(selected) {
        var newScore = selected.value
        let { series_animedb_id } = this.props.animeData
        this.pclient.updateAnime(series_animedb_id, {
            score: newScore
        })
        var updatedObj = {
            my_score: newScore
        }
        this.updateEp(series_animedb_id, updatedObj)
    }

    updateStatus(selected) {
        var newStatus = selected.value
        let { series_animedb_id } = this.props.animeData
        this.pclient.updateAnime(series_animedb_id, {
            status: newStatus
        })
        var updatedObj = {
            my_status: newStatus
        }
        this.updateEp(series_animedb_id, updatedObj)
    }

    incEp(inc) {
        let { series_animedb_id, my_watched_episodes, series_episodes } = this.props.animeData
        this.pclient.updateAnime(series_animedb_id, {
            episode: my_watched_episodes+inc
        })
        var updatedObj = {
            my_watched_episodes: my_watched_episodes+inc
        }
        this.updateEp(series_animedb_id, updatedObj)
    }

    updateEp(malID, updatedObj) {
        this.props.updateAnime(malID, updatedObj)
    }

    launchInfoPage() {
        let { series_title, series_animedb_id } = this.props.animeData     
        var animeName = series_title
        var malID = series_animedb_id
        console.log(malID)
        this.props.launchInfo(animeName, null, null, malID)
        window.location.hash = "#/info"
      }

}

function progressPercent(watched, total) {
    if(total) {
        return Math.ceil(100 * (watched / total)) >= 100 ? 100 : Math.ceil(100 * (watched / total))
    } else if(watched < 12) {
        return Math.ceil(100 * (watched / 13))
    } else return 50
}

function statusCodeToText(statusCode) {
    switch(statusCode) {
        case 1: return 'Currently Watching'; break
        case 2: return 'Completed'; break
        case 3: return 'On Hold'; break
        case 4: return 'Dropped'; break
        case 6: return 'Plan to watch'; break
    }
}

function typeCodeToText(typeCode) {
    switch(typeCode) {
        case 1: return 'TV'; break
        case 2: return 'OVA'; break
        case 3: return 'Movie'; break
        case 4: return 'Special'; break
        case 5: return 'ONA'; break
        case 6: return 'Music'; break
    }
}

function statusColour(statusCode) {
    switch(statusCode) {
        case 1: return '#51e373'; break
        case 2: return '#53b4ff'; break
        case 3: return '#f55353'; break
    }
}

function makeLastUpdated(lastUpdated) {
    return convertMS((Date.now() - (1000 * lastUpdated)))
}

function guessAired(startDate, seriesEps) {
    var startDate = Date.parse(startDate)

    var japanDate = new Date().getTime()+9*60*60*1000 //add 9 hours, getTime() is GMT

    var deltaMS = japanDate-startDate

    let daysSinceStart = deltaMS/(1000*60*60*24) //divide by 1 day in milliseconds
    
    var guessEps = Math.ceil(daysSinceStart / 7)

    var percentAired = 100*(guessEps / seriesEps)

    percentAired = percentAired == 'Infinity' ? 0 : percentAired
    percentAired = percentAired > 100 ? 100 : percentAired

    return percentAired

}

function calcUpdateInterval(lastUpdated) {
    var secondsAgo = (Date.now() / 1000) - lastUpdated
    if(secondsAgo < 3600) { //less than an hour
        return 50000
    }
    if(secondsAgo >= 3600 && secondsAgo < 86400) {
        return 3000000
    }
    return null
}

function dateToSeason(date) {
    var year = parseInt(date.split('-')[0]),
        month = parseInt(date.split('-')[1]),
        day = parseInt(date.split('-')[2])
    //winter 1,2,3 | spring 4,5,6 | summer 7,8,9 | fall 10, 11, 12
    var midMonths = [2, 5, 8, 11]
    var lastMonths = [3, 6, 9, 12]
    var seasonMonth = month
    var seasonMonth = midMonths.includes(month) && day > 15 ? month+1 : month
    seasonMonth = lastMonths.includes(month) ? month+1 : month
    if(seasonMonth > 12) {
        seasonMonth = 1
        year++
    }
    if(seasonMonth > 0 && seasonMonth <= 3) {
        return `Winter ${year}`
    }
    if(seasonMonth > 3 && seasonMonth <= 6) {
        return `Spring ${year}`
    }
    if(seasonMonth > 6 && seasonMonth <= 9) {
        return `Summer ${year}`
    }
    if(seasonMonth > 9 && seasonMonth <= 12) {
        return `Fall ${year}`
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateAnime: (malID, updatedObj) => dispatch(updateAnime(malID, updatedObj)),
        launchInfo: (animeName, a, b, malID) => dispatch(launchInfo(animeName, null, null, malID))
    }
}

export default connect(null, mapDispatchToProps)(ListCard)