import React, { Component } from 'react'
import rp from 'request-promise'
import { connect } from 'react-redux'
import Loader from '../Loader/Loader.jsx'
import ResultCard from './ResultCard.jsx'

class SearchResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resultCards: [],
            nullSearch: false
        }
    }
    
    generateSearchLink(searchValue, searchSort, searchType, searchStatus, searchGenre) {
        if(searchValue) {
            const baseURL = 'https://www.masterani.me/api/anime/search?search='
            return baseURL+searchValue
        }
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
        }).catch(err => {
            console.log(err)
            //network error
        })
    }
    

    componentWillReceiveProps(nextProps) {
        this.setState({ resultCards: [], nullSearch: false })
        let { searchValue, searchSort, searchType, searchStatus, searchGenre } = nextProps
        const searchURL = this.generateSearchLink(searchValue, searchSort, searchType, searchStatus, searchGenre)
        var resultCards = []        
        rp({uri: searchURL, json: true}).then(response => {
            if(response.data && !response.data.length && !Array.isArray(response) || (Array.isArray(response) && !response.length)) {
                this.setState({ nullSearch: true })
            } else {
                var resData = Array.isArray(response) ? response : response.data
                resData.forEach(animeInfo => {
                    resultCards.push(<ResultCard animeData={animeInfo} key={animeInfo.id}/>)
                })
                this.setState({ resultCards })
            }
        }).catch(err => {
            console.log(err)
            //network error
        })
    }

    render() {
        if(this.state.nullSearch) {
            return <div className="null-search">No Results!</div>
        }
        if(!this.state.resultCards.length) {
            return <Loader loaderClass="central-loader"></Loader>
        }
        return (
            <div className="search-results-wrapper">
                <div className="search-results-display">
                    {this.state.resultCards}
                </div>
            </div>
        )
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