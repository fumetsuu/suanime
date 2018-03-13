import React, { Component } from 'react'
import { launchInfo } from '../../actions/actions.js'

export default class ResultCard extends Component {
    constructor(props) {
        super(props)   
        this.launchInfoPage = this.launchInfoPage.bind(this)
    }
    
    render() {
        let { title, poster } = this.props.animeData
        const posterURL = `https://cdn.masterani.me/poster/${poster.file}`

        return (
        <div className="result-card-container" onClick={this.launchInfoPage}>
            <div className="bg-img" style={{backgroundImage: `url('${posterURL}')`}}/>
            <div className="title">{title}</div>
        </div>
        )
    }

    launchInfoPage() {
        let { title, id, slug } = this.props.animeData     
        var animeName = title
        var animeID = id
        console.log(title)
        launchInfo(animeName, slug, animeID, null)
      }
      
}
