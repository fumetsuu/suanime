import React, { Component } from 'react'
import ReactPlayer from 'react-player'

export default class AnimeVideo extends Component {
	render() {
		return (
			<div className="player-wrapper">
				<ReactPlayer url={this.props.videoSrc} className="anime-player"
				width='75%'
				height='100%'/>
			</div>
		)
	}
}