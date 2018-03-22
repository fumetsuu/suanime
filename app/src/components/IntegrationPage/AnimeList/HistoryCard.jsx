import React, { Component } from 'react'
import { statusColour, makeLastUpdated } from '../../../util/animelist';

export default class HistoryCard extends Component {
    render() {
        let { series_animedb_id, series_title, my_watched_episodes, series_status, series_image, my_last_updated } = this.props.data
        return (
            <div className="history-card">
                <div className="status-button" style={{background: statusColour(series_status)}}/>
                <div className="series-title">{series_title}</div>
                <div className="my-episodes">Episode: {my_watched_episodes}</div>
                <div className="last-updated">{makeLastUpdated(my_last_updated)}</div>
            </div>
        )
    }
}

