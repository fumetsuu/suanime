import React, { Component } from 'react'
import DownloadCard from './DownloadCard.jsx'

export default class DownloadsFolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardsArray: [],
            open: false
        }
    }
    
    render() {
        let { cardsArray, open } = this.state
        return (
            <div className="downloads-folder">
                <div className="folder-container" onClick={this.openFolder.bind(this)}>
                    <div className="folder-img" style={{ backgroundImage: `url('${this.props.data.posterImg}')` }} />
                    <div className="folder-info">
                        <div className="folder-title">{this.props.data.animeName}</div>
                        <div className="folder-data">extra info</div>
                    </div>
                </div>
                <div className="folder-contents" style={{ height: open ? 'auto' : '0px' }}>
                    {cardsArray}
                </div>
            </div>
        )
    }


    openFolder() {
        let seriesArray = this.props.data
        var cardsArray = []
        seriesArray.episodes.forEach(el => {
            if(this.props.completedArray.includes(el)) {
                if(!el.props.persistedState) { //legacy support
                    var persistedState = {
                        totalSize: el.props.totalSize,
                        elapsed: el.props.elapsed,
                        completeDate: el.props.completeDate
                    }
                }
                cardsArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} completed="true" key={el.props.animeFilename} persistedState={el.props.persistedState || persistedState} viewType="ROWS"/>)
            } else {
                cardsArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} key={el.props.animeFilename} persistedState={el.props.persistedState} viewType="ROWS"/>)
            }
        })
        this.setState({ cardsArray, open: true })
    }
}
