import React, { Component } from 'react'
import VideoPlayer from 'react-videoplayer'
import 'react-videoplayer/lib/index.css'

export default class AnimeVideo extends Component {
	render() {
		return <VideoPlayer videoSrc="./test.mp4" />
	}
}
