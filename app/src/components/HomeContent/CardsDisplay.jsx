import React, { Component } from 'react'
import cloudscraper from 'cloudscraper'
import AnimeCard from './AnimeCard.jsx'
import Loader from '../Loader/Loader.jsx'
import af from '../../util/animefreak'
// const masteraniReleases = 'https://www.masterani.me/api/releases'

export default class CardsDisplay extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cardsArray: [],
			currentPage: 0
		}
		this.NUM_OF_CARDS = 12
		this.addSpacerCards = this.addSpacerCards.bind(this)
	}

	componentWillMount() {
		af.releases().then(releases => {
			this.releasesData = releases
			for(var i = 0 ; i < this.NUM_OF_CARDS; i++) {
				this.setState({
					cardsArray: [...this.state.cardsArray,<AnimeCard animeDataRecent={releases[i]} key={i}/>]
				})
			}
			this.maxPage = Math.floor(releases.length / this.NUM_OF_CARDS)
			this.addSpacerCards()
		})
	}

	componentDidMount() {
		window.addEventListener('resize', this.addSpacerCards, true)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.addSpacerCards, true)
	}

	render() {
		if(this.state.cardsArray.length == 0) {
			return <Loader loaderClass="central-loader"></Loader>
		} else {
			// var pageBackClass = `pag-btn ${this.state.currentPage == 0 ? 'disabled' : '' }`
			// var pageNextClass = `pag-btn ${this.state.currentPage == this.maxPage ? 'disabled' : '' }`
			return (
				<div className="cards-display-wrapper">
					<div className="cards-display">
						{this.state.cardsArray}
					</div>
					{/* <div className="pagination">
						<div className="spacer-horizontal"/>
						<div className={pageBackClass} onClick={this.pageBack.bind(this)}><i className="material-icons">chevron_left</i></div>
						<div className={pageNextClass}><i className="material-icons" onClick={this.pageNext.bind(this)}>chevron_right</i></div>
						<div className="spacer-horizontal"></div>
					</div> */}
				</div>
			)
		}
	}

	// pageBack() {
	// 	this.setState({
	// 		cardsArray: [],
	// 		currentPage: this.state.currentPage - 1
	// 	}, () => {
	// 		setTimeout(() => {
	// 			for(var i = this.state.currentPage * this.NUM_OF_CARDS; i < (this.state.currentPage + 1) * this.NUM_OF_CARDS; i++) {
	// 				this.setState({
	// 					cardsArray: [...this.state.cardsArray,<AnimeCard animeDataRecent={this.releasesData[i]} key={i}/>]
	// 				})
	// 			}
	// 			this.addSpacerCards()
	// 		}, 1)
	// 	})
	// }

	// pageNext() {
	// 	this.setState({
	// 		cardsArray: [],
	// 		currentPage: this.state.currentPage + 1
	// 	}, () => {
	// 		setTimeout(() => {
	// 			for(var i = this.state.currentPage * this.NUM_OF_CARDS ; i < ((this.state.currentPage + 1) * this.NUM_OF_CARDS>this.releasesData.length ? this.releasesData.length : (this.state.currentPage + 1) * this.NUM_OF_CARDS); i++) {
	// 				this.setState({
	// 					cardsArray: [...this.state.cardsArray,<AnimeCard animeDataRecent={this.releasesData[i]} key={i}/>]
	// 				})
	// 			}
	// 			this.addSpacerCards()
	// 		}, 1)
	// 	})
	// }

	addSpacerCards() {
		this.setState({
			cardsArray: this.state.cardsArray.filter(el => el.props.className != 'invisible card-container'
			)
		})
		var cardWidth = document.querySelector('.card-container').clientWidth + 20
		var containerWidth = document.querySelector('.cards-display').clientWidth
		var cardsInRow = Math.floor(containerWidth / cardWidth)
		var cardsInLastRow = this.state.cardsArray.length % cardsInRow
		if(cardsInLastRow!=0) {
			for(var i = 0; i < cardsInRow-cardsInLastRow; i++) {
				this.setState({
					cardsArray: [...this.state.cardsArray, <div key = {`invis_spacer_${i}`} className = 'invisible card-container'/>]
				})
			}
		}
	}

}