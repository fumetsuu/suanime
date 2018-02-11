import React, { Component } from 'react'

import { connect } from 'react-redux'

class ResultCard extends Component {
    constructor(props) {
        super(props);        

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
        let { title, poster, id, slug } = this.props.animeData     
        var animeName = title
        var posterImg = `https://cdn.masterani.me/poster/${poster.file}`
        var animeID = id
        this.props.launchInfo(animeName, posterImg, slug, animeID)
        window.location.hash = "#/info"
      }
      
}

const mapDispatchToProps = dispatch => {
    return {
        launchInfo: (animeName, posterImg, slug, animeID) => dispatch({
            type: 'LAUNCH_INFO',
            payload: {
              animeName: animeName,
              posterImg: posterImg,
              slug: slug,
              animeID: animeID
            }
          })
    }
}

export default connect(null, mapDispatchToProps)(ResultCard)
