import React, { Component } from 'react'
import { statusColour, makeLastUpdated } from '../../../util/animelist'
import { launchInfo, deleteHistoryCard } from '../../../actions/actions'

import { connect } from 'react-redux'

class HistoryCard extends Component {
    render() {
        let { series_animedb_id, series_title, my_watched_episodes, series_status, series_image, my_last_updated } = this.props.data
        return (
            <div className="history-card">
                <div className="status-button" style={{background: statusColour(series_status)}}/>
                <div className="series-title" onClick={this.launchInfoPage.bind(this)}>{series_title}</div>
                <div className="my-episodes">Episode: {my_watched_episodes}</div>
                <div className="last-updated">{makeLastUpdated(my_last_updated)}</div>
                <div className="delete-history" onClick={this.deleteHistory.bind(this)}><i className="material-icons">clear</i></div>
            </div>
        )
    }

    launchInfoPage() {
        let { series_title, series_animedb_id } = this.props.data
        launchInfo(series_title, null, null, series_animedb_id)
    }

    deleteHistory() {
        let { series_animedb_id, my_watched_episodes, my_last_updated } = this.props.data
        this.props.deleteHistoryCard(series_animedb_id, my_watched_episodes, my_last_updated)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteHistoryCard: (malID, episode, timeUpdated) => dispatch(deleteHistoryCard(malID, episode, timeUpdated))
    }
}

export default connect(null, mapDispatchToProps)(HistoryCard)

