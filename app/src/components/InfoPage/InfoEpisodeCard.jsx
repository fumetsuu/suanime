import React, { Component } from 'react'

export default class InfoEpisodeCard extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let { episode, title, aired } = this.props.epData
        let broadTitle = this.props.broadData.title
        return (
            <div className="info-episode-card">
                <div className="side-flair"/>
                <div className="ep-number">EP. {episode}</div>
                <div className="ep-title">{title?title:broadTitle+' - Episode '+episode}</div>
                <div className="ep-date">{aired}</div>
            </div>
        )
    }
}
