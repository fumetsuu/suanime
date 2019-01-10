import React, { Component } from 'react'
import Loader from '../../Loader/Loader.jsx'
import HistoryCard from './HistoryCard.jsx'
import { connect } from 'react-redux'

class MALHistory extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			isEmpty: false,
			historyCards: []
		}

		this.updateDisplay = this.updateDisplay.bind(this)
	}

	componentDidMount() {
		this.updateDisplay()
	}

	componentWillReceiveProps(nextProps) {
		this.updateDisplay(nextProps.malhistory)
	}
	
	
	render() {
		if(this.state.isLoading) return <div style={{ minHeight: '400px' }}><Loader loaderClass="central-loader"/></div>
		if(this.state.isEmpty) return <div style={{ minHeight: '400px' }} className="history-empty">No History!</div>
		return (
			<div className="history-container">
				{this.state.historyCards}
			</div>
		)
	}

	updateDisplay(history) {
		let malhistory
		if(history) {
			malhistory = history
		} else {
			malhistory = this.props.malhistory
		}
		if(!malhistory.length) {
			this.setState({ isLoading: false, isEmpty: true })
			return false
		}
		console.log(malhistory)
		var historyCards = malhistory.map(el => <HistoryCard key={el.series_animedb_id.toString() + el.my_watched_episodes.toString() + el.my_last_updated.toString()} data={el}/>)
		this.setState({ historyCards, isLoading: false, isEmpty: false })
	}
}

const mapStateToProps = state => {
	return {
		malhistory: state.animelistReducer.malhistory
	}
}

export default connect(mapStateToProps)(MALHistory)
