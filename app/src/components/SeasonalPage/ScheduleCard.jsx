import React from 'react'
import { toAMPM, fixTzOffset, dayofweekFromDayandTime } from '../../util/util.js'

const ScheduleCard = (cardData) => (
    <div className="schedule-card">
        <div className="bg-img" style={{ backgroundImage: `url('https://cdn.masterani.me/poster/${cardData.cardData.anime.poster.file}')`}}/>
        <div className="broadcast-time">{cardData.cardData.release_time ? (((new Date().getHours()+new Date().getMinutes() / 60) > fixTzOffset(cardData.cardData.release_time).timeInHours && dayofweekFromDayandTime(cardData.cardData.day_of_week, cardData.cardData.release_time || '?') == new Date().getDay()) ? 'Ep. '+cardData.cardData.latest_released_episode.episode+' released' : (toAMPM(fixTzOffset(cardData.cardData.release_time)))+' - Ep. '+cardData.cardData.next_episode) : '?'}</div>
        <div className="anime-title">{cardData.cardData.anime.title}</div>
    </div>
);

export default ScheduleCard;
