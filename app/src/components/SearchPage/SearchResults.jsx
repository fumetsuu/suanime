import React, { Component } from 'react'
import rp from 'request-promise'
import { connect } from 'react-redux'
import Loader from '../Loader/Loader.jsx'
import ResultCard from './ResultCard.jsx'

const usepagination = true
class SearchResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resultCards: [],
            nullSearch: false,
            pagePrev: null,
            pageNext: null
        }
        this.stateFromURL = this.stateFromURL.bind(this)
        this.addSpacerCards = this.addSpacerCards.bind(this)
        this.onscroll = this.onscroll.bind(this)
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

    componentDidMount() {
        window.addEventListener('resize', this.addSpacerCards, false)
        if(!usepagination) window.addEventListener('scroll', this.onscroll, true)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.addSpacerCards, false)
        if(!usepagination) window.removeEventListener('scroll', this.onscroll, true)
    }

    onscroll(e) {
        var srcontainer = document.querySelector('.search-results-wrapper')
        if(srcontainer.scrollHeight - e.target.scrollTop <= window.innerHeight + 800) {
            if(this.state.pageNext) {
                window.removeEventListener('scroll', this.onscroll, true)
                this.stateFromURL(this.state.pageNext)
            }
        }
    }

    componentWillMount() {
        if(this.props) {
            let { searchValue, searchSort, searchType, searchStatus, searchGenre } = this.props
            const searchURL = this.generateSearchLink(searchValue, searchSort, searchType, searchStatus, searchGenre)
            this.stateFromURL(searchURL)
        } else {
            const defaultURL = "https://www.masterani.me/api/anime/filter?order=score_desc"
            this.stateFromURL(defaultURL)
        }
    }
    

    componentWillReceiveProps(nextProps) {
        let { searchValue, searchSort, searchType, searchStatus, searchGenre } = nextProps
        const searchURL = this.generateSearchLink(searchValue, searchSort, searchType, searchStatus, searchGenre)
        this.stateFromURL(searchURL)
        if(!usepagination) window.addEventListener('scroll', this.onscroll, true)        
    }

    stateFromURL(url) {
        this.setState({ nullSearch: false })
        if(usepagination) { 
            this.setState({ resultCards: [] })
        }
        rp({uri: url, json: true}).then(response => {
            if(response.data && !response.data.length && !Array.isArray(response) || (Array.isArray(response) && !response.length)) {
                this.setState({ nullSearch: true })
            } else {
                let resultCards
                if(usepagination) {
                    resultCards = []
                } else {
                    resultCards = this.state.resultCards.filter(el => el.props.className!="invisible result-card-container")
                }
                var resData = Array.isArray(response) ? response : response.data
                resData.forEach(animeInfo => {
                    resultCards.push(<ResultCard animeData={animeInfo} key={animeInfo.id}/>)
                })
                var pagePrev = null, pageNext = null
                if(!Array.isArray(response)) {
                    pagePrev = response.prev_page_url ? url+'&page='+(response.current_page-1) : null
                    pageNext = response.next_page_url ? url+'&page='+(response.current_page+1) : null
                }
                this.setState({ resultCards, pagePrev, pageNext }, () => { 
                    this.addSpacerCards()
                    if(!usepagination) window.addEventListener('scroll', this.onscroll, true)
                 })
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
            return <Loader loaderClass="central-loader"/>
        }
        let { pagePrev, pageNext } = this.state
        var pagePrevClass = pagePrev ? 'pag-btn' : 'pag-btn disabled'
        var pageNextClass = pageNext ? 'pag-btn' : 'pag-btn disabled'
        return (
            <div className="search-results-wrapper">
                <div className="search-results-display">
                    {this.state.resultCards}
                </div>
                {usepagination ? <div className="pagination">
                <div className="spacer-horizontal"/>
                <div className={pagePrevClass} onClick={() => {this.stateFromURL(pagePrev)}}><i className="material-icons">chevron_left</i></div>
                <div className={pageNextClass} onClick={() => {this.stateFromURL(pageNext)}}><i className="material-icons" >chevron_right</i></div>
                <div className="spacer-horizontal"></div>
            </div> : null}
            </div>
        )
    }

    addSpacerCards() {
        this.setState({
            resultCards: this.state.resultCards.filter(el => el.props.className!="invisible result-card-container"
            )
        })
        var cardWidth = document.querySelector('.result-card-container').clientWidth+10
        var containerWidth = document.querySelector('.search-results-display').clientWidth
        var cardsInRow = Math.floor(containerWidth / cardWidth)
        var cardsInLastRow = this.state.resultCards.length % cardsInRow
        if(cardsInLastRow!=0) {
            var temparr = []
            for(var i = 0; i < cardsInRow-cardsInLastRow; i++) {
                temparr.push(<div key={`invis_spacer_${i}`} className="invisible result-card-container"/>)
            }
            this.setState({
                resultCards: [...this.state.resultCards, ...temparr]
            })
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