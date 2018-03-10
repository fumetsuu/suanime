import React, { Component } from 'react'
import SeasonalOptions from './SeasonalOptions.jsx'
import SeasonalResults from './SeasonalResults.jsx'
import { seasonFromDate } from '../../util/util.js'

export default class SeasonalContainer extends Component {
    render() {
    let { year, season, type } = this.props.match.params
    year = year || seasonFromDate().year
    season = season || seasonFromDate().season
    type = type || 'all'
    return (
        <div className="seasonal-wrapper">
            <div className="seasonal-container">
                <SeasonalOptions year={year} season={season} type={type}/>
                <SeasonalResults year={year} season={season} type={type}/>
            </div>
        </div>
        )
    }
}
