import React, { Component } from 'react'
const rp = require('request-promise')
import SeasonalCard from './SeasonalCard.jsx'
import { isLeftover } from '../../util/util.js'
import Loader from '../Loader/Loader.jsx'

export default class SeasonalResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rawdata: {},
            typesorteddata: {},
            typesortedcards: [],
            isLoading: true,
            type: 'all',
            APIerror: false
        }
        this.dataToState = this.dataToState.bind(this)
        this.cardsToState = this.cardsToState.bind(this)
    }

    componentDidMount() {
        let { year, season, sort } = this.props
        this.dataToState(year, season, sort)
    }

    componentWillReceiveProps(nextProps) {
        let { year, season, type, sort } = nextProps
        let thisyear = this.props.year, thisseason = this.props.season
        if(thisyear != year || thisseason != season) {
            this.dataToState(year, season, sort)
        }
        this.setState({ type })
        if(sort != this.props.sort && !this.state.isLoading) {
            this.cardsToState(sort)
        }
    }

    // {typesortedcards.tvshort && typesortedcards.tvshort.length && (type=='all' || type=='tv') ?
    // <div className="results-sector-container">
    //     <div className="results-sector-title">TV SHORTS</div>
    //     <div className="results-sector">
    //         {typesortedcards.tvshort}
    //     </div>
    // </div>:null}

    render() {
        let type = this.state.type.toLowerCase()
        if(this.state.APIerror) {
            return <div className="seasonal-error">Nothing here yet!</div>
        }
        if(this.state.isLoading) {
            return <Loader loaderClass="central-loader"/>
        }
        let { typesortedcards } = this.state
        return (
        <div className="seasonal-results">

            {typesortedcards.tv && typesortedcards.tv.length && (type=='all' || type=='tv') ?
                <div className="results-sector-container">
                    <div className="results-sector-title">TV</div>
                    <div className="results-sector">
                        {typesortedcards.tv}
                    </div>
            </div>:null}

            {typesortedcards.tvlo && typesortedcards.tvlo.length && (type=='all' || type=='tv') ?
                <div className="results-sector-container">
                    <div className="results-sector-title">LEFTOVERS</div>
                    <div className="results-sector">
                        {typesortedcards.tvlo}
                    </div>
            </div>:null}

            {typesortedcards.movie && typesortedcards.movie.length && (type=='all' || type=='movie') ?
            <div className="results-sector-container">
                <div className="results-sector-title">MOVIE</div>
                <div className="results-sector">
                    {typesortedcards.movie}
                </div>
            </div>:null}

            {typesortedcards.ova && typesortedcards.ova.length && (type=='all' || type=='ova') ?
            <div className="results-sector-container">
                <div className="results-sector-title">OVA</div>
                <div className="results-sector">
                    {typesortedcards.ova}
                </div>
            </div>:null}

            {typesortedcards.ona && typesortedcards.ona.length && (type=='all' || type=='ona') ?
                <div className="results-sector-container">
                    <div className="results-sector-title">ONA</div>
                    <div className="results-sector">
                        {typesortedcards.ona}
                    </div>
            </div>:null}

            {typesortedcards.special && typesortedcards.special.length && (type=='all' || type=='special') ?
                <div className="results-sector-container">
                    <div className="results-sector-title">SPECIAL</div>
                    <div className="results-sector">
                        {typesortedcards.special}
                    </div>
            </div>:null}
        
        </div>
        )
    }

    dataToState(year, season, sort) {
        this.setState({ isLoading: true, APIerror: false })
        const url = `https://api.jikan.moe/season/${year}/${season.toLowerCase()}`
        // const url = `https://api.myanimelist.net/v2/anime/season/${year}/${season.toLowerCase()}?limit=500&fields=media_type,num_episodes,source,mean,synopsis,start_date,popularity,average_episode_duration,start_date,end_date,status,broadcast`
        rp({ uri: url, json: true }).then(rawdata => {
            let tv = [], tvlo = [], tvshort =[], ova = [], movie = [], special = [], ona = []
            rawdata.season.forEach(el => {
                switch(el.type.toLowerCase()) {
                    case "tv": {
                        if(el.continued) {
                            tvlo.push(el)
                        // } else if(el.node.average_episode_duration && el.node.average_episode_duration < 900) { //if is short
                        //     tvshort.push(el.node)
                        } else {
                            tv.push(el)
                        }
                        break
                    }
                    case "ova": ova.push(el); break
                    case "movie": movie.push(el); break
                    case "music": case "special": special.push(el); break
                    case "ona": ona.push(el); break
                }
            })
            let typesorteddata = { tv, tvlo, ova, movie, special, ona }
            this.setState({ rawdata, typesorteddata }, () => { this.cardsToState(sort) })
        }).catch(err => {
            if(err) {
                this.setState({
                    APIerror: true
                })
            }
        })
    }

    cardsToState(sort) {
        console.log(sort, this.props.sort)
        let imtypesorteddata = this.state.typesorteddata
        sort = sort.toLowerCase()
        let orderA, orderB
        if(sort[0] == 'v') {
            orderA = -1
            orderB = 1
        } else {
            orderA = 1
            orderB = -1
        }
        for(var category in imtypesorteddata) {
            if(imtypesorteddata[category].length) {
                switch(sort) {
                    case 'title': case 'vtitle': imtypesorteddata[category].sort((a, b) => {
                        var atitle = a.title.toLowerCase(),
                            btitle = b.title.toLowerCase()
                        return atitle > btitle ? orderA : orderB
                    })
                    break
                    case 'score': case 'vscore': imtypesorteddata[category].sort((a, b) => {
                        var ascore = a.score || 0,
                            bscore = b.score || 0
                        return ascore <= bscore ? orderA : orderB
                    })
                    break
                    case 'popularity': case'vpopularity': imtypesorteddata[category].sort((a, b) => {
                        var apopularity = a.members || 0,
                            bpopularity = b.members || 0
                        return apopularity > bpopularity ? orderA : orderB
                    })
                }
            }
        }
        let tv = [], tvlo = [], tvshort = [], ova = [], movie = [], special = [], ona = []
        tv = imtypesorteddata.tv.length ? imtypesorteddata.tv.map(data => <SeasonalCard key={data.mal_id} animeData={data}/>) : []
        tvlo = imtypesorteddata.tvlo.length ? imtypesorteddata.tvlo.map(data => <SeasonalCard key={data.mal_id} animeData={data}/>) : []
        // tvshort = imtypesorteddata.tvshort.length ? imtypesorteddata.tvshort.map(data => <SeasonalCard key={data.mal_id} animeData={data}/>) : []
        ova = imtypesorteddata.ova.length ? imtypesorteddata.ova.map(data => <SeasonalCard key={data.mal_id} animeData={data}/>) : []
        movie = imtypesorteddata.movie.length ? imtypesorteddata.movie.map(data => <SeasonalCard key={data.mal_id} animeData={data}/>) : []
        special = imtypesorteddata.special.length ? imtypesorteddata.special.map(data => <SeasonalCard key={data.mal_id} animeData={data}/>) : []
        ona = imtypesorteddata.ona.length ? imtypesorteddata.ona.map(data => <SeasonalCard key={data.mal_id} animeData={data}/>) : []
        let typesortedcards = { tv, tvlo, ova, movie, special, ona }
        this.setState({ typesortedcards, typesorteddata: imtypesorteddata, isLoading: false })
    }
}
