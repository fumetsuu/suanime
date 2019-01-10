import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from '../../Loader/Loader.jsx'
import ListCard from './ListCard.jsx'
import ListStats from './ListStats.jsx'

import { savelist, persistMAL } from '../../../actions/actions.js'

const COMPACT_PER_LOAD = 50
const ROWS_PER_LOAD = 20
const CARDS_PER_LOAD = 20

class MALReadonlyContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			listCards: [],
			listData: props.listdata || [],
			listStatus: 1,
			listSort: 'TITLE',
			listView: 'COMPACT',
			listInfo: props.listinfo || [],
			sortFilteredData: []
		}

		this.logout = this.logout.bind(this)  
		this.getList = this.getList.bind(this)
		this.updateDisplay = this.updateDisplay.bind(this)
		this.loadMore = this.loadMore.bind(this)
		this.setListStatus = this.setListStatus.bind(this)
		this.setListSort = this.setListSort.bind(this)
		this.setListView = this.setListView.bind(this)
		this.syncList = this.syncList.bind(this)
		this.onscroll = this.onscroll.bind(this)

		this.firstLoad = true
	}

	componentDidMount() {
		let { listStatus, listSort, listView } = this.props.persistedMAL
		this.setState({ listStatus, listSort, listView })
		if(!this.firstLoad) {
			if(this.props.listdata || this.state.listData.length) {
				this.updateDisplay()
			} else {
				this.getList()
			}
			this.firstLoad = false
		}
		window.addEventListener('scroll', this.onscroll , true)
	}

	componentWillReceiveProps(nextProps) {
		let { listdata, listinfo } = nextProps
		if(listdata && listinfo) {
			this.setState({ listInfo: listinfo, listData: listdata })
			this.updateDisplay(listdata, listinfo)
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onscroll, true)
	}

	render() {
		let [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch] = this.state.listInfo
		let { listStatus, listSort, listView, listCards, isLoading } = this.state
		return (
			<div className="animelist-wrapper">
				<div className={isLoading ? 'tabs-area disabled' : 'tabs-area'}>
					<div className={`status-tab${listStatus == 1?' status-tab-active':''}`} statusvalue={1} onClick={this.setListStatus}>Currently Watching {user_watching?`(${user_watching})`:''}</div>
					<div className={`status-tab${listStatus == 2?' status-tab-active':''}`} statusvalue={2} onClick={this.setListStatus}>Completed {user_completed?`(${user_completed})`:''}</div>
					<div className={`status-tab${listStatus == 3?' status-tab-active':''}`} statusvalue={3} onClick={this.setListStatus}>On Hold {user_onhold?`(${user_onhold})`:''}</div>
					<div className={`status-tab${listStatus == 4?' status-tab-active':''}`} statusvalue={4} onClick={this.setListStatus}>Dropped {user_dropped?`(${user_dropped})`:''}</div>
					<div className={`status-tab${listStatus == 6?' status-tab-active':''}`} statusvalue={6} onClick={this.setListStatus}>Plan to watch {user_plantowatch?`(${user_plantowatch})`:''}</div>
					<div className="username"> {user_name}</div>
					<div className="square sync" onClick={this.syncList}><i className="material-icons">sync</i></div>
					<div className="square info" onClick={this.openInfo.bind(this)}><i className="material-icons">info</i></div>
					<div className="square logout" onClick={this.logout}><i className="material-icons">exit_to_app</i></div>
				</div>
				{this.props.match.params.stats
					? <ListStats/> : 
					<div className="animelist-container"> 
						<div className={isLoading ? 'sort-area disabled' : 'sort-area'}> 
							<div className="sort-by-text">Sort by: </div> 
							<div sortvalue="TITLE" onClick={this.setListSort} className={`sort-by${/TITLE/.test(listSort)?' sort-by-active':''}`}>Title</div>
							<div sortvalue="PROGRESS" onClick={this.setListSort} className={`sort-by${/PROGRESS/.test(listSort)?' sort-by-active':''}`}>Progress</div> 
							<div sortvalue="SCORE" onClick={this.setListSort} className={`sort-by${/SCORE/.test(listSort)?' sort-by-active':''}`}>Score</div>
							<div sortvalue="AIRED" onClick={this.setListSort} className={`sort-by${/AIRED/.test(listSort)?' sort-by-active':''}`}>Aired</div>
							<div sortvalue="LAST_UPDATED" onClick={this.setListSort} className={`sort-by${/LAST_UPDATED/.test(listSort)?' sort-by-active':''}`}>Last updated</div> 
							<div className="spacer-horizontal"/>
							<div viewvalue="COMPACT" className={`view-mode square${listView == 'COMPACT'?' view-mode-active':''}`} onClick={this.setListView}><i className="material-icons">view_headline</i></div>
							<div viewvalue="ROWS" className={`view-mode square${listView == 'ROWS'?' view-mode-active':''}`} onClick={this.setListView}><i className="material-icons">view_list</i></div>
							<div viewvalue="CARDS" className={`view-mode square${listView == 'CARDS'?' view-mode-active':''}`} onClick={this.setListView}><i className="material-icons">view_module</i></div>
						</div>
						{isLoading ? <Loader loaderClass="central-loader"/>  :
							<div className="animelist-display">
								{listCards}
							</div>
						}
					</div>
				}
			</div> 
		)
	}

	openInfo() {
		window.location.hash = '#/integration/animelist/stats'
		this.setState({ listStatus: 0 })
	}

	logout() {
		global.estore.delete('mal-readonly')
		window.location.hash = '#/integration/login'
	}

	getList() {
		
	}

	syncList() {
		this.setState({ isLoading: true }, () =>{
			this.getList()
		})
	}

	setListStatus(e) {
		if(window.location.hash != '#/integration/animelist') window.location.hash = '#/integration/animelist'
		var listStatus = e.target.getAttribute('statusvalue')
		this.setState({ listStatus }, () => {
			this.updateDisplay()
		})
		this.props.persistMAL(listStatus, this.state.listSort, this.state.listView)
	}

	setListSort(e) {
		var listSort = e.target.getAttribute('sortvalue')
		if(this.state.listSort == listSort) {
			listSort = 'v'+listSort
		}
		this.setState({ listSort }, () => {
			this.updateDisplay()
		})
		this.props.persistMAL(this.state.listStatus,listSort, this.state.listView)
	}

	setListView(e) {
		var listView = e.target.getAttribute('viewvalue')
		this.setState({ listView }, () => {
			this.updateDisplay()
		})
		this.props.persistMAL(this.state.listStatus, this.state.listSort, listView)
	}

	updateDisplay(listdata, listinfo) {
		if(this.state.listStatus == 7) return
		if(listinfo) {
			this.setState({ listInfo: listinfo })
		}
		let { listStatus, listSort, listView } = this.state
		let listData = listdata || this.props.listdata || this.state.listData
		if(listData) {
			var listCards = []
			var statusFilteredData = listData.filter(anime => anime.my_status==listStatus)
			let sortFilteredData
			var orderA = -1, orderB = 1
			if(listSort[0] == 'v') {
				orderA = 1, orderB = -1
			}
			switch(listSort) {
				case 'TITLE': case 'vTITLE': {
					sortFilteredData = statusFilteredData.sort((a1, a2) => {
						var a1title = a1.series_title.toString().toLowerCase(),
							a2title = a2.series_title.toString().toLowerCase()
						return a1title <= a2title ? orderA : orderB
					})
					break
				}
				case 'PROGRESS': case 'vPROGRESS': {
					sortFilteredData = statusFilteredData.sort((a1, a2) => {
						var a1eps = a1.my_watched_episodes,
							a2eps = a2.my_watched_episodes
						return a1eps >= a2eps ? orderA : orderB
					})
					break
				}
				case 'SCORE': case 'vSCORE': {
					sortFilteredData = statusFilteredData.sort((a1, a2) => {
						var a1score = a1.my_score,
							a2score = a2.my_score
						return a1score >= a2score ? orderA : orderB
					})
					break
				}
				case 'AIRED': case 'vAIRED': {
					sortFilteredData = statusFilteredData.sort((a1, a2) => {
						var a1start = a1.series_start,
							a2start = a2.series_start
						return a1start >= a2start ? orderA : orderB
					})
					break
				}
				case 'LAST_UPDATED': case 'vLAST_UPDATED': {
					sortFilteredData = statusFilteredData.sort((a1, a2) => {
						var a1last = a1.my_last_updated,
							a2last = a2.my_last_updated
						return a1last >= a2last ? orderA : orderB
					})
					break
				}
			}
			let cardload
			switch(listView) {
				case 'COMPACT': cardload=COMPACT_PER_LOAD; break
				case 'ROWS': cardload=ROWS_PER_LOAD; break
				case 'CARDS': cardload=CARDS_PER_LOAD; break
			}
			var endIndex = cardload >= sortFilteredData.length ? sortFilteredData.length : cardload
			for(var i = 0; i < endIndex; i++) {
				listCards.push(<ListCard key={sortFilteredData[i].series_animedb_id} animeData={sortFilteredData[i]} pclient={this.pclient} viewType={listView}/>)

			}
			this.setState({ listCards, sortFilteredData, isLoading: false })
		}
	}

	onscroll(e) {
		var alcontainer = document.querySelector('.animelist-container')
		if(alcontainer.scrollHeight - e.target.scrollTop <= window.innerHeight + 200) {
			this.loadMore()
		}
	}

	loadMore() {
		window.removeEventListener('scroll', this.onscroll, true)
		let cardload
		let { listCards, sortFilteredData, listView } = this.state
		switch(listView) {
			case 'COMPACT': cardload=COMPACT_PER_LOAD; break
			case 'ROWS': cardload=ROWS_PER_LOAD; break
			case 'CARDS': cardload=CARDS_PER_LOAD; break
		}
		var addedCards = []
		var currentLength = listCards.length
		var endIndex = currentLength+cardload >= sortFilteredData.length ? sortFilteredData.length : currentLength+cardload
		for(var i = currentLength; i < endIndex; i++) {
			addedCards.push(<ListCard key={sortFilteredData[i].series_animedb_id} animeData={sortFilteredData[i]} pclient={this.pclient} viewType={listView}/>)
		}
		this.setState({ listCards: [...this.state.listCards, ...addedCards] }, () => {
			window.addEventListener('scroll', this.onscroll, true)
		})
	}

}

const mapStateToProps = state => {
	return {
	}
}

const mapDispatchToProps = dispatch => {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MALReadonlyContainer)