import React, { Component } from 'react'
const path = require('path')
import { convertMS } from '../../../util/util.js'
const imageCache = require('image-cache')
imageCache.setOptions({
    dir: path.join(__dirname, '../mal-cache/'),
    compressed: false
})
import { connect } from 'react-redux'
import { updateAnime } from '../../../actions/actions.js'
class ListCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lastUpdated: makeLastUpdated(props.animeData.my_last_updated)
        }
        this.updateEp = this.updateEp.bind(this)
        this.pclient = props.pclient
    }
    
    render() {
        let { series_image, series_title, series_type, series_start, my_status, my_score, my_watched_episodes, series_episodes } = this.props.animeData
        let { lastUpdated } = this.state
        let imgfile = series_image
        imageCache.fetchImages(series_image).then(images => {
            imgfile = images.hashFile
        })
        return (
        <div className="list-card-container">
            <div className="bg-img" style={{ backgroundImage: `url('${imgfile}')`}}/>
            <div className="series-information-container">
                <div className="series-title">{series_title}</div>
                
                <div className="series-average series-info"></div>
                <div className="series-type series-info">Type: {typeCodeToText(series_type)}</div>
                <div className="series-season series-info">{series_start}</div>
            </div>
            <div className="my-info">
                <div className="last-updated">Last updated: {lastUpdated}</div>
                <div className="info-label">Status: </div>
                <div className="info-editable">{statusCodeToText(my_status)}</div>
                <div className="info-label">Score: </div>
                <div className="info-editable">{my_score}</div>
                <div className="info-label">Progress: </div>
                <div className="progress-info-container">
                    <div className="progress-bar-container">
                        <div className="progress-bar-progress" style={{width: progressPercent(my_watched_episodes, series_episodes)+'%'}} />
                    </div>
                    <div className="prog-btn" onClick={() => {this.updateEp(-1)}}><i className="material-icons">remove</i></div>
                    <div className="prog-btn" onClick={() => {this.updateEp(1)}}><i className="material-icons">add</i></div>
                    <div className="progress-text">{my_watched_episodes}/{series_episodes}</div>
                </div>
            </div>
        </div>
        )
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

    updateEp(inc) {
        let { series_animedb_id, my_watched_episodes } = this.props.animeData
        if(my_watched_episodes != 0 && my_watched_episodes != series_animedb_id) {
            this.pclient.updateAnime(series_animedb_id, {
                episode: my_watched_episodes+inc
            })
        }
        var updatedObj = {
            my_watched_episodes: my_watched_episodes+inc
        } 
        this.props.updateAnime(series_animedb_id, updatedObj)
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

function makeLastUpdated(lastUpdated) {
    return convertMS((Date.now() - (1000 * lastUpdated)))
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

const mapDispatchToProps = dispatch => {
    return {
        updateAnime: (malID, updatedObj) => dispatch(updateAnime(malID, updatedObj))
    }
}

export default connect(null, mapDispatchToProps)(ListCard)