import React, { Component } from 'react'
import { getMALStats } from '../../../util/getMALStats.js'
import Loader from '../../Loader/Loader.jsx'

export default class ListStats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listStats: {},
            isLoading: true
        }
        this.listStatsToState = this.listStatsToState.bind(this)
    }

    componentDidMount() {
        this.listStatsToState()
    }
    
    render() {
        if(this.state.isLoading) return <div style={{ minHeight: '400px' }}><Loader loaderClass="central-loader"/></div>
        let { totalEntries, rewatched, episodes, days, mean, dateJoined } = this.state.listStats
        return (
        <div className="list-stats-container">
            <table className="list-stats">
                <tbody>
                    <tr>
                        <td className="data-label">Anime Count:</td>
                        <td>{totalEntries}</td>
                    </tr>
                    <tr>
                        <td className="data-label">Total Episodes:</td>
                        <td>{episodes}</td>
                    </tr>
                    <tr>
                        <td className="data-label">Rewatched:</td>
                        <td>{rewatched}</td>
                    </tr>
                    <tr>
                        <td className="data-label">Days Watched:</td>
                        <td>{days} days</td>
                    </tr>
                    <tr>
                        <td className="data-label">Mean Score:</td>
                        <td>{mean.toString().padEnd(4, '0')}</td>
                    </tr>
                    <tr>
                        <td className="data-label">Date Joined MAL:</td>
                        <td>{dateJoined}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        )
    }

    listStatsToState() {
        var username = global.estore.get('mal').user
        getMALStats(username, (listStats, err) => {
            this.setState({ listStats, isLoading: false })
        })
    }
}
