import React, { Component } from 'react'
import { connect } from 'react-redux'
class AnimeListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            listCards: [],
            listData: null,
            listStatus: 'CW',
            listSort: 'TITLE',
            listView: 'ROWS',
            listInfo: []
        }

        this.pclient = this.props.pclient
        this.logout = this.logout.bind(this)  
        this.getList = this.getList.bind(this)
        
        this.getList()
    }
    
    render() {
        let [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch] = this.state.listInfo
        return (
        <div className="animelist-wrapper">
            <div className="tabs-area">
                <div className="status-tab">Currently Watching {`(${user_watching})`}</div>
                <div className="status-tab status-tab-active">Completed {`(${user_completed})`}</div>
                <div className="status-tab">On Hold {`(${user_onhold})`}</div>
                <div className="status-tab">Dropped {`(${user_dropped})`}</div>
                <div className="status-tab">Plan to watch {`(${user_plantowatch})`}</div>
                <div className="username"> {user_name}</div>
                <div className="square info"><i className="material-icons">info</i></div>
                <div className="square logout" onClick={this.logout}><i className="material-icons">exit_to_app</i></div>
            </div>
            <div className="animelist-container">
                <div className="sort-area">
                    <div className="sort-by-text">Sort by: </div>
                    <div className="sort-by">Title</div>
                    <div className="sort-by">Progress</div>
                    <div className="sort-by">Score</div>
                    <div className="sort-by">Aired</div>
                    <div className="sort-by">Last updated</div>
                    <div className="spacer-horizontal"/>
                    <div className="view-mode square"><i className="material-icons">view_headline</i></div>
                    <div className="view-mode square"><i className="material-icons">view_list</i></div>
                    <div className="view-mode square"><i className="material-icons">view_module</i></div>
                </div>
                <div className="animelist-display">
                    cards go here haaaaaayyyyyyyyyyyyyyy
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
                    listInfo: [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch]
                })
            })
            .catch(err => console.log(err))
    }

}

const mapStateToProps = state => {
    return {
        pclient: state.animelistReducer.pclient
    }
}

export default connect(mapStateToProps)(AnimeListContainer)