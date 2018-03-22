import React, { Component } from 'react'
const rp = require('request-promise')
import Loader from '../Loader/Loader.jsx'
import InfoHeader from './InfoHeader.jsx'
import InfoMain from './InfoMain.jsx'
import InfoEpisodes from './InfoEpisodes.jsx'
import { fixURL } from '../../util/util.js'
import { processExceptions } from './processExceptions';
const h2p = require('html2plaintext')

export default class InfoContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            MALData: null,
        }
        this.stateFromMAL = this.stateFromMAL.bind(this)
    }

    componentDidMount() {
        let { animeName, malID } = this.props.match.params
        if(malID) {
            this.stateFromMALID(malID)
        } else {
            this.stateFromMAL(decodeURIComponent(animeName))
        }
    }

    componentWillReceiveProps(nextProps) {
        let { animeName, malID } = nextProps.match.params
        if(malID) {
            this.stateFromMALID(malID)
        } else {
            this.stateFromMAL(decodeURIComponent(animeName))
        }
    }
    
    render() {
        if(this.state.isLoading) {
            return <Loader loaderClass="central-loader"/>
        }
        let { slug, animeID, animeName } = this.props.match.params
        let { MALData } = this.state
        let { title, title_english, title_japanese, link_canonical, mal_id, status, aired, image_url, episodes, type } = MALData
        var masteraniLink = `https://www.masterani.me/anime/info/${slug}`
        return (
        <div className="info-wrapper">
            <div className="info-container">
                <InfoHeader title={title} title_english={title_english} title_japanese={title_japanese} link={link_canonical} masteraniLink={masteraniLink} malID={mal_id} aired={aired} image_url={image_url} episodes={episodes} type={type} status={status} history={this.props.history}/>
                <InfoMain MALData={MALData}/> 
                <InfoEpisodes animeName={animeName} slug={slug} animeID={animeID}/>
            </div>
        </div>
        )
    }

    stateFromMAL(animeName) {
        this.setState({ isLoading: true })
        const searchURL = `http://api.jikan.me/search/anime/${fixURL(animeName)}`
        console.log(searchURL)
        rp({ uri: searchURL, json: true }).then(results => {
            console.log(results, animeName)
            var first = processExceptions(results, animeName)
            const infoURL = `http://api.jikan.me/anime/${first.id}`
            rp({ uri: infoURL, json: true }).then(MALData => {
                this.setState({ MALData, isLoading: false })
            })
        })
    }

    stateFromMALID(malID) {
        this.setState({ isLoading: true })
        const infoURL = `http://api.jikan.me/anime/${malID}`
        rp({ uri: infoURL, json: true }).then(MALData => {
            this.setState({ MALData, isLoading: false })
        })
    }

}