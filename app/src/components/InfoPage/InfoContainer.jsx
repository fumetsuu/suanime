import React, { Component } from 'react'
const rp = require('request-promise')
import Loader from '../Loader/Loader.jsx'
import InfoHeader from './InfoHeader.jsx'
import InfoMain from './InfoMain.jsx'
import InfoEpisodes from './InfoEpisodes.jsx'
import { connect } from 'react-redux'

class InfoContainer extends Component {
    constructor(props) {
        super(props)
        if(!props.animeID) {
            window.location.hash = "#/"
        }
        this.state = {
            isLoading: true,
            MALData: null
        }
        this.stateFromMAL = this.stateFromMAL.bind(this)
    }

    componentDidMount() {
        let { animeName } = this.props
        const searchURL = `http://api.jikan.me/search/anime/${encodeURIComponent(animeName)}`
        this.stateFromMAL(searchURL)
    }
    
    render() {
        if(this.state.isLoading) {
            return <Loader loaderClass="central-loader"/>
        }
        let { slug } = this.props
        let { MALData } = this.state
        let { title, title_english, title_japanese, link_canonical } = MALData
        var masteraniLink = `https://www.masterani.me/anime/info/${slug}`
        //pass maldata to infomain and masterani slug to episodes
        return (
        <div className="info-wrapper">
            <div className="info-container">
                <InfoHeader title={title} title_english={title_english} title_japanese={title_japanese} link={link_canonical} masteraniLink={masteraniLink}/>
                <InfoMain/> 
                <InfoEpisodes/>
            </div>
        </div>
        )
    }

    stateFromMAL(url) {
        rp({ uri: url, json: true }).then(results => {
            const infoURL = `http://api.jikan.me/anime/${results.result[0].id}`
            rp({ uri: infoURL, json: true }).then(MALData => {
                this.setState({ MALData, isLoading: false })
            })
        })
    }
}

const mapStateToProps = state => {
    return {
        animeName: state.infoReducer.animeName,
        posterImg: state.infoReducer.posterImg,
        slug: state.infoReducer.slug,
        animeID: state.infoReducer.animeID
    }
}

export default connect(mapStateToProps)(InfoContainer)