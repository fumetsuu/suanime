import React, { Component } from 'react'
import rp from 'request-promise'
import { connect } from 'react-redux'
import Loader from '../Loader/Loader.jsx'
import ResultCard from './ResultCard.jsx'

class SearchResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resultCards: []
        }
    }
    
    generateSearchLink(searchValue, searchSort, searchType, searchStatus, searchGenre) {
        const baseURL = 'https://www.masterani.me/api/anime/filter?'
        var sortAdd = 'order='+searchSort.value
        var typeAdd = searchType.value != 'default' ? '&type='+searchType.value : ''
        var statusAdd = searchStatus.value != 'default' ? '&status='+searchStatus.value : ''
        var genreAdd = (searchGenre.label && searchGenre.label == 'ALL') ? '': '&genres='+searchGenre.map(el => el.value).join(",")
        return baseURL+sortAdd+typeAdd+statusAdd+genreAdd
    }

    
    componentWillMount() {
        const defaultURL = "https://www.masterani.me/api/anime/filter?order=score_desc"
        var resultCards = []
        rp({uri: defaultURL, json: true}).then(response => {
            response.data.forEach(animeInfo => {
                resultCards.push(<ResultCard animeData={animeInfo} key={animeInfo.id}/>)
            })
            this.setState({ resultCards })
        })
    }
    

    componentWillReceiveProps(nextProps) {
        let { searchValue, searchSort, searchType, searchStatus, searchGenre } = nextProps
        console.log('hey', this.generateSearchLink(searchValue, searchSort, searchType, searchStatus, searchGenre))
        this.setState({ firstLoad: false})
    }

    render() {
        if(!this.state.resultCards.length) {
            return <Loader loaderClass="central-loader"></Loader>
        } else {
            return (
                <div className="search-results-wrapper">
                    <div className="search-results-display">
                        {this.state.resultCards}
                    </div>
                </div>
                )
        }
    }
}

const mapStateToProps = state => {
    return {
        searchValue: state.searchReducer.searchValue,
        searchSort: state.searchReducer.searchSort,
        searchType: state.searchReducer.searchType,
        searchStatus: state.searchReducer.searchStatus,
        searchGenre: state.searchReducer.searchGenre
    }
}

export default connect(mapStateToProps)(SearchResults)