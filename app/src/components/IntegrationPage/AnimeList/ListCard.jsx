import React, { Component } from 'react'

export default class ListCard extends Component {
    render() {
        let { series_image } = this.props.animeData
        return (
        <div className="list-card-container">
            <div className="bg-img" style={{ backgroundImage: `url('${series_image}')`}}/>
        </div>
        )
    }
}
