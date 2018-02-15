import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from '../../Loader/Loader.jsx'
import ListCard from './ListCard.jsx'

const CARDS_PER_LOAD = 20
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
            listInfo: [],
            sortFilteredData: []
        }

        this.pclient = this.props.pclient
        this.logout = this.logout.bind(this)  
        this.getList = this.getList.bind(this)
        this.updateDisplay = this.updateDisplay.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.setListStatus = this.setListStatus.bind(this)
        this.setListSort = this.setListSort.bind(this)
        this.syncList = this.syncList.bind(this)
    }

    componentDidMount() {

        if(global.estore.get("listdata") && global.estore.get("listinfo")) {
            this.setState({ 
                listData: global.estore.get("listdata"),
                listInfo: global.estore.get("listinfo"),
                isLoading: false }, () => {
                this.updateDisplay()
                })
        } else {
            this.getList()
        }
        window.addEventListener('scroll', (e) => {
            var alcontainer = document.querySelector('.animelist-container')
            if(alcontainer.scrollHeight - e.target.scrollTop <= window.innerHeight + 100) {
                this.loadMore()
            }
        }, true)
    }
    
    render() {
        let [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch] = this.state.listInfo
        let { listStatus, listSort, listView, isLoading } = this.state
        return (
        <div className="animelist-wrapper">
            <div className="tabs-area">
                <div className={`status-tab${listStatus == 1?' status-tab-active':''}`} statusvalue={1} onClick={this.setListStatus}>Currently Watching {user_watching?`(${user_watching})`:''}</div>
                <div className={`status-tab${listStatus == 2?' status-tab-active':''}`} statusvalue={2} onClick={this.setListStatus}>Completed {user_completed?`(${user_completed})`:''}</div>
                <div className={`status-tab${listStatus == 3?' status-tab-active':''}`} statusvalue={3} onClick={this.setListStatus}>On Hold {user_onhold?`(${user_onhold})`:''}</div>
                <div className={`status-tab${listStatus == 4?' status-tab-active':''}`} statusvalue={4} onClick={this.setListStatus}>Dropped {user_dropped?`(${user_dropped})`:''}</div>
                <div className={`status-tab${listStatus == 6?' status-tab-active':''}`} statusvalue={6} onClick={this.setListStatus}>Plan to watch {user_plantowatch?`(${user_plantowatch})`:''}</div>
                <div className="username"> {user_name}</div>
                <div className="square sync" onClick={this.syncList}><i className="material-icons">sync</i></div>
                <div className="square info"><i className="material-icons">info</i></div>
                <div className="square logout" onClick={this.logout}><i className="material-icons">exit_to_app</i></div>
            </div>
            <div className="animelist-container"> 
                <div className="sort-area"> 
                    <div className="sort-by-text">Sort by: </div> 
                    <div sortvalue="TITLE" onClick={this.setListSort} className={`sort-by${listSort == 'TITLE'?' sort-by-active':''}`}>Title</div>
                    <div sortvalue="PROGRESS" onClick={this.setListSort} className={`sort-by${listSort == 'PROGRESS'?' sort-by-active':''}`}>Progress</div> 
                    <div sortvalue="SCORE" onClick={this.setListSort} className={`sort-by${listSort == 'SCORE'?' sort-by-active':''}`}>Score</div>
                    <div sortvalue="AIRED" onClick={this.setListSort} className={`sort-by${listSort == 'AIRED'?' sort-by-active':''}`}>Aired</div>
                    <div sortvalue="LAST_UPDATED" onClick={this.setListSort} className={`sort-by${listSort == 'LAST_UPDATED'?' sort-by-active':''}`}>Last updated</div> 
                    <div className="spacer-horizontal"/>
                    <div className={`view-mode square${listView == 'COMPACT'?' view-mode-active':''}`}><i className="material-icons">view_headline</i></div>
                    <div className={`view-mode square${listView == 'ROWS'?' view-mode-active':''}`}><i className="material-icons">view_list</i></div>
                    <div className={`view-mode square${listView == 'CARDS'?' view-mode-active':''}`}><i className="material-icons">view_module</i></div>
                </div>
                {isLoading ? <Loader loaderClass="central-loader"/>  :
                <div className="animelist-display">
                    {this.state.listCards}
                </div>
                }
            </div>
        </div> 
        )
    }

    logout() {
        global.estore.delete("mal")
        //dispatch kill pclient
        window.location.hash = "#/integration/login"
    }

    getList() {
        this.pclient.getAnimeList()
            .then(res => {
                let { user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch } = res.myinfo
                var listInfo = [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch]
                global.estore.delete('listdata')
                global.estore.delete('listInfo')
                global.estore.set({
                    listdata: res.list,
                    listinfo: listInfo
                })
                this.setState({
                    listInfo: listInfo,
                    listData: res.list,
                    isLoading: false
                }, () => {
                    this.updateDisplay()
                })
            })
            .catch(err => console.log(err))
    }

    syncList() {
        this.setState({ isLoading: true }, () =>{
            this.getList()
        })
    }

    setListStatus(e) {
        var listStatus = e.target.getAttribute("statusvalue")
        this.setState({ listStatus }, () => {
            this.updateDisplay()
        })
    }

    setListSort(e) {
        var listSort = e.target.getAttribute("sortvalue")
        this.setState({ listSort }, () => {
            this.updateDisplay()
        })
    }

    updateDisplay() {
        let { listData, listStatus, listSort } = this.state
        if(listData) {
            var listCards = []
            var statusFilteredData = listData.filter(anime => anime.my_status==listStatus)
            //may have to use switch-case for different sorting types possibly
            let sortFilteredData
            switch(listSort) {
                case 'TITLE': {
                    sortFilteredData = statusFilteredData.sort((a1, a2) => {
                        var a1title = a1.series_title.toString().toLowerCase(),
                            a2title = a2.series_title.toString().toLowerCase()
                        return a1title <= a2title ? -1 : 1
                    })
                    break
                }
                case 'PROGRESS': {
                    sortFilteredData = statusFilteredData.sort((a1, a2) => {
                        var a1eps = a1.my_watched_episodes,
                            a2eps = a2.my_watched_episodes
                        return a1eps >= a2eps ? -1 : 1
                    })
                    break
                }
                case 'SCORE': {
                    sortFilteredData = statusFilteredData.sort((a1, a2) => {
                        var a1score = a1.my_score,
                            a2score = a2.my_score
                        return a1score >= a2score ? -1 : 1
                    })
                    break
                }
                case 'AIRED': {
                    sortFilteredData = statusFilteredData.sort((a1, a2) => {
                        var a1start = a1.series_start,
                            a2start = a2.series_start
                        return a1start >= a2start ? -1 : 1
                    })
                    break
                }
                case 'LAST_UPDATED': {
                    sortFilteredData = statusFilteredData.sort((a1, a2) => {
                        var a1last = a1.my_last_updated,
                            a2last = a2.my_last_updated
                        return a1last >= a2last ? -1 : 1
                    })
                    break
                }
            }
            var endIndex = CARDS_PER_LOAD >= sortFilteredData.length ? sortFilteredData.length : CARDS_PER_LOAD
            for(var i = 0; i < endIndex; i++) {
                listCards.push(<ListCard key={sortFilteredData[i].series_animedb_id} animeData={sortFilteredData[i]}/>)

            }
            this.setState({ listCards, sortFilteredData })
        }
    }

    loadMore() {
        console.log("loading more.....")
        let { listCards, sortFilteredData } = this.state
        var addedCards = []
        var currentLength = listCards.length
        var endIndex = currentLength+CARDS_PER_LOAD >= sortFilteredData.length ? sortFilteredData.length : currentLength+CARDS_PER_LOAD
        for(var i = currentLength; i < endIndex; i++) {
            addedCards.push(<ListCard key={sortFilteredData[i].series_animedb_id} animeData={sortFilteredData[i]}/>)
        }
        this.setState({ listCards: [...this.state.listCards, ...addedCards] })
    }

}

const mapStateToProps = state => {
    return {
        pclient: state.animelistReducer.pclient
    }
}

export default connect(mapStateToProps)(AnimeListContainer)