import React, { Component } from 'react'
const rp = require('request-promise')
import SeasonalCard from './SeasonalCard.jsx'
import { isLeftover } from '../../util/util.js'

export default class SeasonalResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rawdata: {},
            typesorteddata: {},
            typesortedcards: []
        }
        this.dataToState = this.dataToState.bind(this)
        this.cardsToState = this.cardsToState.bind(this)
    }

    componentDidMount() {
        let { year, season } = this.props
        this.dataToState(year, season)
    }

    componentWillReceiveProps(nextProps) {
        let { year, season } = nextProps
        this.dataToState(year, season)
    }
    

    render() {
        let { typesortedcards } = this.state
        return (
        <div className="seasonal-results">
        {typesortedcards.tv && typesortedcards.tv.length ?
            <div className="results-sector-container">
                <div className="results-sector-title">TV</div>
                <div className="results-sector">
                    {typesortedcards.tv}
                </div>
            </div>:null}
        </div>
        )
    }

    dataToState(year, season) {
        const url = `https://api.myanimelist.net/v0.20/anime/season/${year}/${season.toLowerCase()}?limit=500&fields=media_type,num_episodes,source,mean,synopsis,start_date`
        rp({ uri: url, json: true }).then(rawdata => {
            let tv = [], tvlo = [], ova = [], movie = [], special = [], ona = []
            rawdata.data.forEach(el => {
                switch(el.node.media_type) {
                    case "tv": {
                        if(isLeftover(year, season, el.node.start_date)) {
                            tvlo.push(el.node)
                        } else {
                            tv.push(el.node)
                        }
                        break
                    }
                    case "ova": ova.push(el.node); break
                    case "movie": movie.push(el.node); break
                    case "music": case "special": special.push(el.node); break
                    case "ona": ona.push(el.node); break
                }
            })
            let typesorteddata = { tv, tvlo, ova, movie, special, ona }
            this.setState({ rawdata, typesorteddata }, () => { this.cardsToState() })
        })
    }

    cardsToState() {
        let { typesorteddata } = this.state
        let tv = [], tvlo = [], ova = [], movie = [], special = [], ona = []
        tv = typesorteddata.tv.length ? typesorteddata.tv.map(data => <SeasonalCard key={data.id} animeData={data}/>) : []
        tvlo = typesorteddata.tvlo.length ? typesorteddata.tvlo.map(data => <SeasonalCard key={data.id} animeData={data}/>) : []
        ova = typesorteddata.ova.length ? typesorteddata.ova.map(data => <SeasonalCard key={data.id} animeData={data}/>) : []
        movie = typesorteddata.movie.length ? typesorteddata.movie.map(data => <SeasonalCard key={data.id} animeData={data}/>) : []
        special = typesorteddata.special.length ? typesorteddata.special.map(data => <SeasonalCard key={data.id} animeData={data}/>) : []
        ona = typesorteddata.ona.length ? typesorteddata.ona.map(data => <SeasonalCard key={data.id} animeData={data}/>) : []
        let typesortedcards = { tv, tvlo, ova, movie, special, ona }
        this.setState({ typesortedcards })
    }
}
