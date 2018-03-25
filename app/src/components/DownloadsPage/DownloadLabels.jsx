import React from 'react';

const DownloadLabels = () => (
    <div className="download-card-container download-card-container-compact">
        <div className="status-circle"/>
        <div className="download-title">Title</div>
        <div className="download-complete-date">Completed</div>
        <div className="download-network-data download-speed">Speed</div>
        <div className="download-network-data download-size">Size</div>
        <div className="download-network-data download-percentage">%</div>
        <div className="download-network-data download-elapsed">Elapsed</div>
        <div className="download-network-data download-remaining">Remaining</div>
    </div>
)

export default DownloadLabels
