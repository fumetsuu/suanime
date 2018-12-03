import React, { Component } from 'react'
import { toAMPM, fixTzOffset, dayofweekFromDayandTime } from '../../util/util.js'
import { launchInfo } from '../../actions/actions.js'
import { loadMAImage } from '../../util/maImageLoader.js';

class ScheduleCard extends Component {
    constructor(props) {
        super(props)
        this.state = { cposter: '' }
    }

    componentWillMount() {
        var { cardData } = this.props
        var posterURL = `https://cdn.masterani.me/poster/${cardData.anime.poster.file}`
        loadMAImage(posterURL).then(imgData => {
            this.setState({ cposter: imgData })
        }).catch(console.log)
    }

    render() {
        var { cardData } = this.props
        return <div className="schedule-card" onClick={() => {launchInfo(cardData.anime.title, cardData.anime.slug, cardData.anime.id)}}>
            <div className="bg-img" style={{ backgroundImage: `url('data:image/jpeg;base64,${this.state.cposter}')`}}/>
            <div className="broadcast-time">{cardData.release_time ? (((new Date().getHours()+new Date().getMinutes() / 60) > fixTzOffset(cardData.release_time).timeInHours && dayofweekFromDayandTime(cardData.day_of_week, cardData.release_time || '?') == new Date().getDay()) ? 'Ep. '+cardData.latest_released_episode.episode+' released' : (toAMPM(fixTzOffset(cardData.release_time)))+' - Ep. '+cardData.next_episode) : '?'}</div>
            <div className="anime-title">{cardData.anime.title}</div>
        </div>
    }
    
}

export default ScheduleCard
