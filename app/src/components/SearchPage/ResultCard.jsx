import React, { Component } from 'react'

export default class ResultCard extends Component {
    constructor(props) {
        super(props);
        
    }
    
    render() {
        let { title, poster } = this.props.animeData
        const posterURL = `https://cdn.masterani.me/poster/${poster.file}`

        return (
        <div className="result-card-container">
            <div className="bg-img" style={{backgroundImage: `url('${posterURL}')`}}/>
            <div className="title">{title}</div>
        </div>
        )
    }
}
