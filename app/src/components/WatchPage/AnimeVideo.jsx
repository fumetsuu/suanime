import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
const moment = require('moment')
const momentDurationFormatSetup = require("moment-duration-format")
momentDurationFormatSetup(moment)

export default class AnimeVideo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			controlsWidth: '95%',
			url: this.props.videoSrc,
			playing: false,
			volume: 1,
			muted: false,
			played: 0,
			duration: 0,
			playbackRate: 1,
			duration: 0,
			elapsed: 0,
			played: 0,
			seeking: false
		}
	}

	componentDidMount() {
		this.fixWidths()
        window.addEventListener('resize', () => {
			this.fixWidths()
		})
		screenfull.on('change', () => {
			this.fixWidths()
		})
	}

	fixWidths() {
		var playerWrapper = document.getElementsByClassName('anime-player')[0]
		this.setState({
			controlsWidth: playerWrapper.clientHeight*1.78 >= playerWrapper.clientWidth ? '95%' : (playerWrapper.clientHeight*1.78-50)+'px'
		})
	}

	ref(player) {
		this.player = player
	}

	render() {
		const { url, playing, volume, muted, played, duration, playbackRate } = this.state
		return (
			<div className="player-wrapper">
				<ReactPlayer
				ref={this.ref.bind(this)} 
				url={url} 
				className="anime-player"
				width='100%'
				height='100%'
				playing={playing}
				playbackRate={playbackRate}
				volume={volume}
				muted={muted}
				onProgress={this.onProgress.bind(this)}
				onDuration={this.onDuration.bind(this)}/>
				<div className="anime-video-controls" style={{width: this.state.controlsWidth}}>
					<div className="video-control-button" onClick={this.playPause.bind(this)}><i className="material-icons">{playing?'pause':'play_arrow'}</i></div>
					<div className="video-control-button" onClick={this.toggleMuted.bind(this)}><i className="material-icons">{muted ? 'volume_off' : (volume < 0.5 ?'volume_down':'volume_up')}</i></div>
					<div className="progress-text">{moment.duration(duration*played, "seconds").format(this.durationTemplate(duration*played), { trim: false })} / {moment.duration(duration, "seconds").format(this.durationTemplate(duration), { trim: false })}</div>
					<input
					type='range' min={0} max={1} step='any'
					value={played}
					onMouseDown={this.onSeekMouseDown.bind(this)}
					onChange={this.onSeekChange.bind(this)}
					onMouseUp={this.onSeekMouseUp.bind(this)}
					/>
					<div className="speed-text">{playbackRate}</div>  
					<div className="video-control-button" onClick={this.incPlaybackRate.bind(this)}><i className="material-icons">add_box</i></div>
					<div className="video-control-button" onClick={this.decPlaybackRate.bind(this)}><i className="material-icons">indeterminate_check_box</i></div>
					<div className="video-control-button fullscreen-btn" onClick={this.goFullscreen.bind(this)}><i className="material-icons">fullscreen</i></div>
					
				</div>
			</div>
		)
	}

	playPause() {
		this.setState({ playing: !this.state.playing })
	}

	toggleMuted() {
		this.setState({ muted: !this.state.muted })
	}

	onDuration(duration) {
		this.setState({ duration })
	}

	onProgress(state) {
	if (!this.state.seeking) {
		this.setState(state)
		}
	}

	onSeekMouseDown(e) {
		this.setState({ seeking: true })
	}
	
	onSeekChange(e) {
		this.setState({ played: parseFloat(e.target.value) })
	}

	onSeekMouseUp(e) {
		this.setState({ seeking: false })
		this.player.seekTo(parseFloat(e.target.value))
	}

	incPlaybackRate() {
		var newpb = (this.state.playbackRate+0.1).toFixed(2)
		this.setState({ playbackRate: Number(newpb) })
	}

	decPlaybackRate() {
		var newpb = (this.state.playbackRate-0.1).toFixed(2)
		this.setState({ playbackRate: Number(newpb) })
	}

	goFullscreen() {
		screenfull.toggle(document.getElementsByClassName('player-wrapper')[0])
	}

	durationTemplate(secs) {
		return secs >= 3600 ? " hh:mm:ss" : " mm:ss"
	}

}