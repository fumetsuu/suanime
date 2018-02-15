import React, { Component } from 'react'
const path = require('path')
import { convertMS } from '../../../util/util.js'
const imageCache = require('image-cache')
imageCache.setOptions({
    dir: path.join(__dirname, '../mal-cache/'),
    compressed: false
})

export default class ListCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardData: {
                series_animedb_id: props.animeData.series_animedb_id,
                series_title: props.animeData.series_title,
                series_synonyms: props.animeData.series_synonyms,
                series_type: props.animeData.series_type,
                series_episodes: props.animeData.series_episodes,
                series_status: props.animeData.series_status,
                series_start: props.animeData.series_start,
                series_end: props.animeData.series_animedb_id,
                series_image: props.animeData.series_image,
                my_id: props.animeData.my_id,
                my_watched_episodes: props.animeData.my_watched_episodes,
                my_start_date: props.animeData.my_start_date,
                my_finish_date: props.animeData.my_finish_date,
                my_score: props.animeData.my_score,
                my_status: props.animeData.my_status,
                my_rewatching: props.animeData.my_rewatching,
                my_rewatching_ep: props.animeData.my_rewatching_ep,
                my_last_updated: props.animeData.my_last_updated,
                my_tags: props.animeData.my_tags
            }
        }
        this.updateEp = this.updateEp.bind(this)
        this.pclient = props.pclient
    }
    
    render() {
        let { series_image, series_title, series_type, series_start, my_last_updated, my_status, my_score, my_watched_episodes, series_episodes } = this.state.cardData
        console.log(this.state)
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
                <div className="last-updated">Last updated: {convertMS((Date.now()-1000*my_last_updated))}</div>
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

    updateEp(inc) {
        let { series_animedb_id, my_watched_episodes } = this.state.cardData
        if(my_watched_episodes != 0 && my_watched_episodes != series_animedb_id) {
            this.pclient.updateAnime(series_animedb_id, {
                episode: my_watched_episodes+inc
            })
        }
        this.setState({ 
            cardData: Object.assign({}, this.state.cardData, {
                my_watched_episodes: my_watched_episodes+inc
            })
        })
        //go through estore take the json replace the json for the particular anime being updated then put it back, while also updating state locally here
    }

}

function progressPercent(watched, total) {
    if(total) {
        return Math.ceil(100 * (watched / total))
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