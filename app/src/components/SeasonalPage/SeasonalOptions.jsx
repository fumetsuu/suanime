import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import { yearOptions, seasonOptions, typeOptions } from './seasonalOptionsData.js'

export default class SeasonalOptions extends Component {
    constructor(props) {
        super(props)
    }
    

    render() {
        let { year, season, type } = this.props
        var yearOps = yearOptions()
        return (
            <div className="seasonal-options">
                <div className="dropdown-container years-dropdown">
                <div className="small-header"> Year </div>
                <Dropdown className="dropdown-options" options={yearOps} onChange={this.handleYearChange.bind(this)} value={yearOps.find(el => el.value == year)} placeholder="YEAR"/></div>
                <div className="dropdown-container">
                <div className="small-header"> Season </div>
                <Dropdown className="dropdown-options" options={seasonOptions} onChange={this.handleSeasonChange.bind(this)} value={seasonOptions.find(el => el.value == season)} placeholder="SEASON"/></div>
                <div className="dropdown-container">
                <div className="small-header"> Type </div>
                <Dropdown className="dropdown-options" options={typeOptions} onChange={this.handleTypeChange.bind(this)} value={typeOptions.find(el => el.label.toLowerCase() == type.toLowerCase())} placeholder="TYPE"/></div>
            </div>
        )
    }

    handleYearChange(selected) {
        let { season, type } = this.props
        let newyear = selected.value
        let newlocation = `#/seasonal/${newyear}/${season}/${type}`
        window.location.hash = newlocation
    }

    handleSeasonChange(selected) {
        let { year, type } = this.props
        let newseason = selected.value
        let newlocation = `#/seasonal/${year}/${newseason}/${type}`
        window.location.hash = newlocation
    }

    handleTypeChange(selected) {
        let { year, season } = this.props
        let newtype = selected.label
        let newlocation = `#/seasonal/${year}/${season}/${newtype}`
        window.location.hash = newlocation
    }
}
