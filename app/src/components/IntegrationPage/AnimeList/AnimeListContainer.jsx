import React, { Component } from 'react'
import { connect } from 'react-redux'
class AnimeListContainer extends Component {
    constructor(props) {
        super(props)
        this.logout = this.logout.bind(this)   
    }
    
    render() {
        return (
        <div className="animelist-wrapper">
            <div className="tabs-area">
                <div className="status-tab">Currently Watching</div>
                <div className="status-tab status-tab-active">Completed</div>
                <div className="status-tab">On Hold</div>
                <div className="status-tab">Dropped</div>
                <div className="status-tab">Plan to watch</div>
                <div className="username">fumetsu</div>
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
}

const mapStateToProps = state => {
    return {
        pclient: state.animelistReducer.pclient
    }
}

export default connect(mapStateToProps)(AnimeListContainer)