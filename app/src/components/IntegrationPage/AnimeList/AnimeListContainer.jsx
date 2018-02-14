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
            <div className="animelist-container">
                <div className="square logout" onClick={this.logout}><i className="material-icons">exit_to_app</i></div>
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