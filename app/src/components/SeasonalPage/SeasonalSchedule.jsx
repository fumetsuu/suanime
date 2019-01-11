import React, { Component } from 'react'
import cloudscraper from 'cloudscraper'
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
				<div className={this.state.filterWatching ? 'filter-watching blue-bg' : 'filter-watching'} onClick={() => {this.setState({filterWatching: !this.state.filterWatching})}}>Filter Watching</div>
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
		cloudscraper.request({ method: 'GET', url: scheduleURL}, (err, response, body) => {
			if(err) throw err
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
	}

	cardsFromData(scheduledata) {
		let schedulecards = [[],[],[],[],[],[],[]]
		scheduledata.schedules.forEach(el => {
			const card = <ScheduleCard key={el.anime_id || el.id} cardData={el}/>
			var fixedDay = dayofweekFromDayandTime(el.day_of_week, el.release_time || '?')
			if (schedulecards[fixedDay]) schedulecards[fixedDay].push(card)
		})
		let today = new Date().getDay()
		let sortedschedulecards = schedulecards.slice(today).concat(schedulecards.slice(0, today))
		this.setState({ sortedschedulecards, isLoading: false })
	}
	
	filterWatching(cat) {
		let { listdata } = this.props
		if(!listdata) return cat
		return cat.filter(el => {
			var listItem = listdata.find(listel => listel.anime_title == el.props.cardData.anime.title)
			return listItem && listItem.status == 1
		})
	}
}

const mapStateToProps = state => {
	return {
		listdata: state.MALReadonlyReducer.listdata
	}
}

export default connect(mapStateToProps)(SeasonalSchedule)