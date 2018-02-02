import React from 'react';
import DownloadsHolder from './DownloadsHolder.jsx'
const DownloadsContainer = () => (
    <div className="downloads-container-wrapper">
        <div className="downloads-container">
            <div className="header-wrapper">
                <div className="dl-header">Downloads</div>
            </div>
            <DownloadsHolder/>
        </div>
    </div>
);

export default DownloadsContainer;
