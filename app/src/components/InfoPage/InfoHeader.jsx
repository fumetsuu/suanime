import React from 'react';
import { browserLink } from '../../util/browserlink.js'

const InfoHeader = (title, title_english, title_japanese, link, masteraniLink) => {
    return (
        <div className="info-header">
            <div className="info-header-title">
                {title.title}
                {title.title_japanese ? <div className="jp-title"><br/>JP: {title.title_japanese}</div> : null}
            </div>
            <div className="vertical-spacer"/>
            <div className="anime-out-link masterani-circle" onClick={() => browserLink(title.masteraniLink)}/>
            <div className="anime-out-link mal-circle" onClick={() => browserLink(title.link)}/>
        </div>
    )
}

export default InfoHeader;
