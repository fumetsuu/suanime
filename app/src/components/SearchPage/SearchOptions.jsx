import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import GenreSearch from './GenreSearch.jsx'
import { sortOptions, typeOptions, statusOptions, genreOptions } from './searchOptionsData.js'
import { search } from '../../actions/actions.js'

import { connect } from 'react-redux'

class SearchOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchValue: '',
            searchSort: sortOptions[0],
            searchType: typeOptions[0],
            searchStatus: statusOptions[0],
            searchGenre: genreOptions[0]
        }
    }

    render() {
        var searchBarClass = "search-bar"
        var searchValid = (this.state.searchValue.length > 0 && this.state.searchValue.length < 3)
        searchBarClass += searchValid ? " search-invalid" : ''
        var searchButtonClass = "search-bar-button"
        searchButtonClass += searchValid ? " disabled" : ''
        return (
        <div className="search-options" onSubmit={this.fireSearch.bind(this)}>
            <form className="search-bar-container">
                <input type="text" className={searchBarClass} placeholder="Search Anime..." onChange={this.handleSearchChange.bind(this)}/>
                <button type="submit" value="submit" className={searchButtonClass}><i className="material-icons">search</i></button>
            </form>
            <div className="dropdown-container">
            <div className="small-header">SORT</div>
                <Dropdown className="dropdown-options" options={sortOptions} onChange={this.handleSortChange.bind(this)} value={this.state.searchSort} placeholder="SORT"/>
            </div>
            <div className="dropdown-container">
            <div className="small-header">TYPE</div>
                <Dropdown className="dropdown-options" options={typeOptions} onChange={this.handleTypeChange.bind(this)} value={this.state.searchType} placeholder="TYPE"/>
            </div>
            <div className="dropdown-container">
            <div className="small-header">STATUS</div>
                <Dropdown className="dropdown-options" options={statusOptions} onChange={this.handleStatusChange.bind(this)} value={this.state.searchStatus} placeholder="STATUS"/>
            </div>
            <div className="dropdown-container">
            <div className="small-header">GENRE</div>
                <GenreSearch className="dropdown-options" options={genreOptions} onChange={this.handleGenreChange.bind(this)} value={genreOptions[0]} placeholder="ALL"/>
            </div>
        </div>
        )
    }

    fireSearch() {
        let { searchValue, searchSort, searchType, searchStatus, searchGenre } = this.state
        this.props.search(searchValue, searchSort, searchType, searchStatus, searchGenre)
    }

    handleSearchChange(e) {
        this.setState({
            searchValue: e.target.value
        })
    }

    handleSortChange(e) {
        this.setState({
            searchSort: e
        })
    }

    handleTypeChange(e) {
        this.setState({
            searchType: e
        })
    }

    handleStatusChange(e) {
        this.setState({
            searchStatus: e
        })
    }

    handleGenreChange(e) {
        this.setState({
            searchGenre: e
        })
    }
}

const mapDispatchToProps = dispatch => {
    return {
        search: (searchValue, searchSort, searchType, searchStatus, searchGenre) => dispatch(
            search(searchValue, searchSort, searchType, searchStatus, searchGenre)
        )
    }
}

export default connect(null, mapDispatchToProps)(SearchOptions)