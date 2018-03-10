import React, { Component } from 'react'
const rp = require('request-promise')

export default class SeasonalResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rawdata: null,
            typesorteddata: null
        }
        this.dataToState = this.dataToState.bind(this)
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
        console.log(this.state.rawdata, this.state.typesorteddata)
        return (
        <div className="seasonal-results">
                {this.props.year}
        </div>
        )
    }

    dataToState(year, season) {
        const url = `https://api.myanimelist.net/v0.20/anime/season/${year}/${season.toLowerCase()}?limit=500&fields=media_type,num_episodes,source,mean`
        rp({ uri: url, json: true }).then(rawdata => {
            let tv = [], ova = [], movie = [], special = [], ona = []
            rawdata.data.forEach(el => {
                switch(el.node.media_type) {
                    case "tv": tv.push(el.node); break
                    case "ova": ova.push(el.node); break
                    case "movie": movie.push(el.node); break
                    case "music": case "special": special.push(el.node); break
                    case "ona": ona.push(el.node); break
                }
            })
            let typesorteddata = { tv, ova, movie, special, ona }
            this.setState({ rawdata, typesorteddata })
        })
    }
}
