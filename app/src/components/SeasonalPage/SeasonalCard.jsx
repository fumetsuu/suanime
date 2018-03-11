import React, { Component } from 'react'
import { convertSec } from '../../util/util.js'

export default class SeasonalCard extends Component {
    render() {
        let { title, main_picture, media_type, num_episodes, source, mean, synopsis, average_episode_duration } = this.props.animeData
        return (
        <div className="seasonal-card">
            <div className="bg-img" style={{ backgroundImage: `url('${(main_picture ? main_picture.medium : 'http://sweettutos.com/wp-content/uploads/2015/12/placeholder.png')}')` }}/>
            <div className="left-data">
                <div className="anime-title">{title}</div>
            </div>
            <div className="right-data">
                <div className="stats-data anime-meta">
                    <div className="stat-data">{mean?mean:'-'}</div>
                    <div className="stat-data middle">{average_episode_duration < 900 ? 'Short' : (media_type.length < 4 ? media_type.toUpperCase() : media_type[0].toUpperCase()+media_type.substr(1))}</div>
                    <div className="stat-data">{num_episodes==0?'?':num_episodes} eps</div>
                </div>
                <div className="anime-synopsis">{synopsis}</div>
                <div className="bottom">
                    <div className="stat-data first-bottom">{source ? source.replace(/_/g, ' ') : ''}</div>
                    <div className="stat-data">{convertSec(average_episode_duration) || '?'}</div>
                </div>
            </div>
        </div>
        )
    }
}