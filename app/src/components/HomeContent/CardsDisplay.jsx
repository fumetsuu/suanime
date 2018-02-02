import React, { Component } from 'react'
const rp = require('request-promise')
import AnimeCard from './AnimeCard.jsx'
import Loader from '../Loader/Loader.jsx'
const masteraniReleases = 'https://www.masterani.me/api/releases'
const NUM_OF_CARDS = 10
var maxPage = 5
let releasesData


export default class CardsDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardsArray: [],
            currentPage: 0
        }
    }

    componentWillMount() {
        rp({
            uri: masteraniReleases,
            json: true
        }).then(releases => {
            releasesData = releases
            for(var i = 0 ; i < NUM_OF_CARDS; i++) {
                this.setState({
                    cardsArray: [...this.state.cardsArray,<AnimeCard animeDataRecent={releases[i]}/>]
                })
            }
            maxPage = Math.ceil(releases.length / NUM_OF_CARDS)-1
            addSpacerCards(this)
        })
    }

    componentDidMount() {
        window.addEventListener('resize', () => {addSpacerCards(this)})
    }

    render() {
        if(this.state.cardsArray.length == 0) {
            return <Loader loaderClass="central-loader"></Loader>
        } else {
            var pageBackClass = `pag-btn ${this.state.currentPage==0?'disabled':''}`
            var pageNextClass = `pag-btn ${this.state.currentPage==maxPage?'disabled':''}`
        return (
            <div className="cards-display-wrapper">
                <div className="cards-display">
                    {this.state.cardsArray}
                </div>
                    <div className="pagination">
                        <div className="spacer-horizontal"/>
                        <div className={pageBackClass} onClick={this.pageBack.bind(this)}><i className="material-icons">chevron_left</i></div>
                        <div className={pageNextClass}><i className="material-icons" onClick={this.pageNext.bind(this)}>chevron_right</i></div>
                        <div className="spacer-horizontal"></div>
                    </div>
            </div>
            )
        }
    }

    pageBack() {
        this.setState({
            cardsArray: [],
            currentPage: this.state.currentPage-1
        }, () => {
            setTimeout(() => {
                for(var i = this.state.currentPage*NUM_OF_CARDS ; i < (this.state.currentPage+1)*NUM_OF_CARDS; i++) {
                    this.setState({
                        cardsArray: [...this.state.cardsArray,<AnimeCard animeDataRecent={releasesData[i]}/>]
                    })
                }
                addSpacerCards(this)
            }, 1)
        })
    }

    pageNext() {
        this.setState({
            cardsArray: [],
            currentPage: this.state.currentPage+1
        }, () => {
            setTimeout(() => {
                for(var i = this.state.currentPage*NUM_OF_CARDS ; i < ((this.state.currentPage+1)*NUM_OF_CARDS>releasesData.length?releasesData.length:(this.state.currentPage+1)*NUM_OF_CARDS); i++) {
                    this.setState({
                        cardsArray: [...this.state.cardsArray,<AnimeCard animeDataRecent={releasesData[i]}/>]
                    })
                }
                addSpacerCards(this)
            }, 1)
        })
    }
}

function addSpacerCards(comp) {
    comp.setState({
        cardsArray: comp.state.cardsArray.filter(el =>      el.props.className!="invisible card-container"
        )
    })
    var cardWidth = document.querySelector('.card-container').clientWidth+20
    var containerWidth = document.querySelector('.cards-display').clientWidth
    var cardsInRow = Math.floor(containerWidth / cardWidth)
    var cardsInLastRow = comp.state.cardsArray.length % cardsInRow
    if(cardsInLastRow!=0) {
        for(var i = 0; i < cardsInRow-cardsInLastRow; i++) {
            comp.setState({
                cardsArray: [...comp.state.cardsArray, <div className="invisible card-container"/>]
            })
        }
    }
}