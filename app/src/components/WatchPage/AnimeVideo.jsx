import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
const moment = require('moment')
const momentDurationFormatSetup = require("moment-duration-format")
momentDurationFormatSetup(moment)

class AnimeVideo extends Component {
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
			seeking: false,
			fullscreen: false,
			controlsClass: "anime-video-controls",
			volSliderClass: "volume-slider none"
		}
	}

	componentDidMount() {
		this.fixWidths()
        window.addEventListener('resize', () => {
			this.fixWidths()
		})
		window.addEventListener('keypress', e => {
			console.log(e.keyCode)
			switch(e.keyCode) {
				case 68: case 100: this.incPlaybackRate(); break
				case 83: case 115: this.decPlaybackRate(); break
				case 77: case 109: this.toggleMuted(); break
				case 70: case 102: this.goFullscreen(); break
				case 75: case 107: this.playPause(); break
				case 32: this.playPause(); break
				case 81: case 113: this.seekAmount(-10); break
				case 69: case 101: this.seekAmount(10); break
			}
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
		const { url, playing, volume, muted, played, duration, playbackRate, fullscreen, controlsClass, volSliderClass } = this.state
		return (
			<div className={fullscreen?'player-wrapper video-fullscreen':'player-wrapper'}
			onMouseEnter={this.showControls.bind(this)}
			onMouseLeave={this.hideControls.bind(this)}>
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
				onDuration={this.onDuration.bind(this)}
				onClick={this.playPause.bind(this)}
				onDoubleClick={this.goFullscreen.bind(this)}/>
				<div className={controlsClass} style={{width: this.state.controlsWidth}}>
					<div className="video-control-button" onClick={this.playPause.bind(this)}><i className="material-icons">{playing?'pause':'play_arrow'}</i></div>
					<div className="video-control-button" onClick={this.toggleMuted.bind(this)} onMouseEnter={this.showVolSlider.bind(this)}><i className="material-icons">{(muted || volume == 0) ? 'volume_off' : (volume < 0.5 ?'volume_down':'volume_up')}</i></div>
					<input className={volSliderClass}
					type='range' min={0} max={1} step='any'
					value={volume}
					onChange={this.setVolume.bind(this)}
					onMouseLeave={this.hideVolSlider.bind(this)}
					/>
					<div className="progress-text">{moment.duration(duration*played, "seconds").format(this.durationTemplate(duration*played), { trim: false })} / {moment.duration(duration, "seconds").format(this.durationTemplate(duration), { trim: false })}</div>
					<input className="progress-slider"
					type='range' min={0} max={1} step='any'
					value={played}
					onMouseDown={this.onSeekMouseDown.bind(this)}
					onChange={this.onSeekChange.bind(this)}
					onMouseUp={this.onSeekMouseUp.bind(this)}
					/>
					<div className="speed-text">{playbackRate}</div>  
					<div className="video-control-button" onClick={this.incPlaybackRate.bind(this)}><i className="material-icons">add_box</i></div>
					<div className="video-control-button" onClick={this.decPlaybackRate.bind(this)}><i className="material-icons">indeterminate_check_box</i></div>
					<div className="video-control-button fullscreen-btn" onClick={this.goFullscreen.bind(this)}><i className="material-icons">{fullscreen?'fullscreen_exit':'fullscreen'}</i></div>
					
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

	seekAmount(seconds) {
		this.player.seekTo(this.player.getCurrentTime()+seconds)
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
		this.setState({ fullscreen: !this.state.fullscreen })
	}

	setVolume(e) {
		this.setState({ volume: parseFloat(e.target.value) })
	}

	showControls() {
		this.setState({
			controlsClass: "anime-video-controls"
		})
	}

	hideControls() {
		this.setState({
			controlsClass: "anime-video-controls none",
			volSliderClass: "volume-slider none"
		})
	}

	showVolSlider() {
		this.setState({
			volSliderClass: "volume-slider"
		})
	}

	hideVolSlider() {
		this.setState({
			volSliderClass: "volume-slider none"
		})
	}

	durationTemplate(secs) {
		return secs >= 3600 ? " hh:mm:ss" : " mm:ss"
	}

}

export default AnimeVideo