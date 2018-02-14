import React, { Component } from 'react'
import { connect } from 'react-redux'
import ListCard from './ListCard.jsx'
class AnimeListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            listCards: [],
            listData: null,
            listStatus: 1,
            listSort: 'TITLE',
            listView: 'ROWS',
            listInfo: []
        }

        this.pclient = this.props.pclient
        this.logout = this.logout.bind(this)  
        this.getList = this.getList.bind(this)
        this.updateDisplay = this.updateDisplay.bind(this)
        this.setListStatus = this.setListStatus.bind(this)
        
        this.getList()
    }
    
    render() {
        let [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch] = this.state.listInfo
        let { listStatus, listSort, listView } = this.state
        return (
        <div className="animelist-wrapper">
            <div className="tabs-area">
                <div className={`status-tab${listStatus == 1?' status-tab-active':''}`} statusvalue={1} onClick={this.setListStatus}>Currently Watching {`(${user_watching})`}</div>
                <div className={`status-tab${listStatus == 2?' status-tab-active':''}`} statusvalue={2} onClick={this.setListStatus}>Completed {`(${user_completed})`}</div>
                <div className={`status-tab${listStatus == 3?' status-tab-active':''}`} statusvalue={3} onClick={this.setListStatus}>On Hold {`(${user_onhold})`}</div>
                <div className={`status-tab${listStatus == 4?' status-tab-active':''}`} statusvalue={4} onClick={this.setListStatus}>Dropped {`(${user_dropped})`}</div>
                <div className={`status-tab${listStatus == 6?' status-tab-active':''}`} statusvalue={6} onClick={this.setListStatus}>Plan to watch {`(${user_plantowatch})`}</div>
                <div className="username"> {user_name}</div>
                <div className="square info"><i className="material-icons">info</i></div>
                <div className="square logout" onClick={this.logout}><i className="material-icons">exit_to_app</i></div>
            </div>
            <div className="animelist-container">
                <div className="sort-area">
                    <div className="sort-by-text">Sort by: </div>
                    <div className={`sort-by${listSort == 'TITLE'?' sort-by-active':''}`}>Title</div>
                    <div className={`sort-by${listSort == 'PROGRESS'?' sort-by-active':''}`}>Progress</div>
                    <div className={`sort-by${listSort == 'SCORE'?' sort-by-active':''}`}>Score</div>
                    <div className={`sort-by${listSort == 'AIRED'?' sort-by-active':''}`}>Aired</div>
                    <div className={`sort-by${listSort == 'LAST_UPDATED'?' sort-by-active':''}`}>Last updated</div>
                    <div className="spacer-horizontal"/>
                    <div className={`view-mode square${listView == 'COMPACT'?' view-mode-active':''}`}><i className="material-icons">view_headline</i></div>
                    <div className={`view-mode square${listView == 'ROWS'?' view-mode-active':''}`}><i className="material-icons">view_list</i></div>
                    <div className={`view-mode square${listView == 'CARDS'?' view-mode-active':''}`}><i className="material-icons">view_module</i></div>
                </div>
                <div className="animelist-display">
                    {this.state.listCards}
                </div>
            </div>
        </div>
        )
    }

    logout() {
        global.estore.delete("mal")
        window.location.hash = "#/integration/login"
    }

    getList() {
        this.pclient.getAnimeList()
            .then(res => {
                let { user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch } = res.myinfo
                this.setState({
                    listInfo: [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch],
                    listData: res.list
                }, () => {
                    this.updateDisplay()
                })
            })
            .catch(err => console.log(err))
    }

    setListStatus(e) {
        var listStatus = e.target.getAttribute("statusvalue")
        console.log(listStatus)
        this.setState({ listStatus }, () => {
            this.updateDisplay()
        })
    }

    updateDisplay() {
        let { listData, listStatus } = this.state
        if(listData) {
            var listCards = []
            var statusFilteredData = listData.filter(anime => anime.my_status==listStatus)
            //may have to use switch-case for different sorting types possibly
            var sortFilteredData = statusFilteredData.sort((a1, a2) => {
                var a1title = a1.series_title.toString().toLowerCase(),
                    a2title = a2.series_title.toString().toLowerCase()
                return a1title <= a2title ? -1 : 1
            })
            sortFilteredData.forEach(animeData => {
                listCards.push(<ListCard key={animeData.series_animedb_id} animeData={animeData}/>)
            })
            this.setState({ listCards })
        }
    }

}

const mapStateToProps = state => {
    return {
        pclient: state.animelistReducer.pclient
    }
}

export default connect(mapStateToProps)(AnimeListContainer)