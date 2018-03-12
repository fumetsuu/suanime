import React, { Component } from 'react'
import SeasonalOptions from './SeasonalOptions.jsx'
import SeasonalResults from './SeasonalResults.jsx'
import SeasonalSchedule from './SeasonalSchedule.jsx'
import { seasonFromDate } from '../../util/util.js'

export default class SeasonalContainer extends Component {
    render() {
    let { year, season, type, sort } = this.props.match.params
    year = year || seasonFromDate().year
    season = season || seasonFromDate().season
    type = type || 'all'
    sort = sort || 'Score'
    if(year == 'schedule') {
        return (
            <div className="seasonal-wrapper">
                <div className="seasonal-container">
                    <SeasonalOptions year={year} season={season} type={type} sort={sort}/>
                    <SeasonalSchedule/>
                </div>
            </div> 
        )
    }
    return (
        <div className="seasonal-wrapper">
            <div className="seasonal-container">
                <SeasonalOptions year={year} season={season} type={type} sort={sort}/>
                <SeasonalResults year={year} season={season} type={type} sort={sort}/>
            </div>
        </div>
        )
    }
}
