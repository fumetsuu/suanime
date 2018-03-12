import React from 'react';

const ScheduleCard = (cardData) => (
    <div className="schedule-card">
        <div className="bg-img" style={{ backgroundImage: `url('https://cdn.masterani.me/poster/${cardData.cardData.anime.poster.file}')`}}/>
        <div className="broadcast-time">{cardData.cardData.release_time || '?'}</div>
        <div className="anime-title">{cardData.cardData.anime.title}</div>
    </div>
);

export default ScheduleCard;
