import React from 'react';

const WatchInformation = (props) => (
    <div className="watch-information">
    <div className="watch-title">{props.animeName} 
        <br></br> 
        <div className="watch-episode">{props.epNumber}</div>
    </div>
</div>
);

export default WatchInformation;
