import React, { Component } from 'react'
const rp = require('request-promise')
import { dayToString, dayofweekFromDayandTime } from '../../util/util.js'
import Loader from '../Loader/Loader.jsx'
import ScheduleCard from './ScheduleCard.jsx'
import { connect } from 'react-redux'

class SeasonalSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sortedschedulecards: [],
            isLoading: true,
            filterWatching: false
        }
        this.getScheduleData = this.getScheduleData.bind(this)
        this.cardsFromData = this.cardsFromData.bind(this)
    }
    
    componentDidMount() {
        this.getScheduleData()
    }
    

    render() {
        if(this.state.isLoading) {
            return <Loader loaderClass="central-loader"/>
        }
        return (
        <div className="schedule-results">
            <div className={this.state.filterWatching?"filter-watching blue-bg":"filter-watching"} onClick={() => {this.setState({filterWatching: !this.state.filterWatching})}}>Filter Watching</div>
            {this.state.sortedschedulecards.map((el, idx) =>
                <div className="schedule-sector-container">
                    <div className="schedule-sector-title">{dayToString(idx)}</div>
                    <div className="schedule-sector">
                        {this.state.filterWatching ? this.filterWatching(el) : el}
                    </div>
                </div>
            )}
        </div>
        )
    }

    getScheduleData() {
        const scheduleURL = 'https://www.masterani.me/anime/schedule'
        rp.get(scheduleURL).then(body => {
            var scheduledataformat = /var args = {(.*)}/g
            var match = scheduledataformat.exec(body)
            var scheduledata = JSON.parse(
                match[0]
                    .split('args = ')[1]
                    .replace(/schedules: \[/, '"schedules": [')
                    .split(', watching: [')[0]
                    + '}'
            )
            this.cardsFromData(scheduledata)
        })
        .catch(err => console.log(err))
    }

    cardsFromData(scheduledata) {
        let schedulecards = [[],[],[],[],[],[],[]]
        scheduledata.schedules.forEach(el => {
            const card = <ScheduleCard key={el.anime_id || el.id} cardData={el}/>
            var fixedDay = dayofweekFromDayandTime(el.day_of_week, el.release_time || '?')
            schedulecards[fixedDay].push(card)
        })
        let today = new Date().getDay()
        let sortedschedulecards = schedulecards.slice(today).concat(schedulecards.slice(0, today))
        console.log(sortedschedulecards)
        this.setState({ sortedschedulecards, isLoading: false })
    }
    
    filterWatching(cat) {
        let { listdata } = this.props
        console.log(cat)
        if(!listdata) return cat
        return cat.filter(el => listdata.find(listel => listel.series_title == el.props.cardData.anime.title) && listdata.find(listel => listel.series_title == el.props.cardData.anime.title).my_status == 1)
    }
}

const mapStateToProps = state => {
    return {
        listdata: state.animelistReducer.listdata
    }
}

export default connect(mapStateToProps)(SeasonalSchedule)