import React, { Component } from 'react'
const rp = require('request-promise')
import { dayToString } from '../../util/util.js'
import Loader from '../Loader/Loader.jsx'
import ScheduleCard from './ScheduleCard.jsx'

export default class SeasonalSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sortedschedulecards: [],
            isLoading: true
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
            {this.state.sortedschedulecards.map((el, idx) =>
                <div className="schedule-sector-container">
                    <div className="schedule-sector-title">{dayToString(idx)}</div>
                    <div className="schedule-sector">
                        {el}
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
                    .replace(/watching: \[/, '"watching": [')
            )
            this.cardsFromData(scheduledata)
        })
        .catch(err => console.log(err))
    }

    cardsFromData(scheduledata) {
        let schedulecards = [[],[],[],[],[],[],[]]
        scheduledata.schedules.forEach(el => {
            const card = <ScheduleCard key={el.anime_id || el.id} cardData={el}/>
            schedulecards[el.day_of_week].push(card)
        })
        let today = new Date().getDay()
        let sortedschedulecards = schedulecards.slice(today).concat(schedulecards.slice(0, today))
        console.log(sortedschedulecards)
        this.setState({ sortedschedulecards, isLoading: false })
    }
}
