import React, { Component } from 'react'

export default class SeasonalCard extends Component {
    render() {
        let { title, main_picture, media_type, num_episodes, source, mean, synopsis } = this.props.animeData
        return (
        <div className="seasonal-card">
            <div className="bg-img" style={{ backgroundImage: `url('${main_picture.medium}')` }}/>
            <div className="left-data">
                <div className="anime-title">{title}</div>
            </div>
            <div className="right-data">
                <div className="stats-data anime-meta">
                    <div className="stat-data">{mean}</div>
                    <div className="stat-data middle">{media_type}</div>
                    <div className="stat-data">{num_episodes} eps</div>
                </div>
                <div className="anime-synopsis">{synopsis}</div>
                <div className="bottom">{source}</div>
            </div>
        </div>
        )
    }
}
