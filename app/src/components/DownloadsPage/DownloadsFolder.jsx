import React, { Component } from 'react'
import DownloadCard from './DownloadCard.jsx'

export default class DownloadsFolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardsArray: []
        }
    }

    componentDidMount() {
        this.updateDisplay()
    }
    
    render() {
        return (
            <div className="downloads-folder">
                <div className="folder-container">
                    <div className="folder-img" style={{ backgroundImage: `url('${this.props.data.posterImg}')` }} />
                    <div className="folder-info">
                        <div className="folder-title">{this.props.data.animeName}</div>
                        <div className="folder-data">extra info</div>
                    </div>
                </div>
            </div>
        )
    }

    updateDisplay() {
        var seriesArray = this.props.data


    }
}
