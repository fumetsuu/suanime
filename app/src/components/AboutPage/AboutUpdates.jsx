import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import bytes from 'bytes'

export default class AboutUpdates extends Component {
	constructor(props) {
		super(props)
		this.state = {
			updateStatus: -1,
			buttonText: 'Check for updates',
			isUpdating: false,
			extraInfo: ''
		}
		this.handleStatusUpdate = this.handleStatusUpdate.bind(this)
	}
	
	componentDidMount() {
		ipcRenderer.on('update-status', this.handleStatusUpdate)
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('update-status', this.handleStatusUpdate)
	}

	render() {
		let { updateStatus, buttonText, isUpdating, extraInfo } = this.state
		return (
			<div className="about-updates">
				<div className="version">Version: <b>{require('electron').remote.app.getVersion()}</b></div>
				<div className={`check-for-updates${isUpdating? ' disabled':''}`} onClick={this.checkForUpdates.bind(this)}>{buttonText}</div>
				{updateStatus == 4 ? 
					<div className="update-progress-container">
						{`Speed: ${bytes(extraInfo.bytesPerSecond)}/s  |  ${(extraInfo.percent).toFixed(2)}%  |  ${bytes(extraInfo.transferred)}/${bytes(extraInfo.total)}`}
					</div>
					: null
				}
				{updateStatus == 4 ? 
					<div className="update-progress-bar" style={{ width: extraInfo.percent+'%'}}/>
					: null
				}
			</div>
		)
	}

	checkForUpdates() {
		switch(this.state.updateStatus) {
			case -1: {
				ipcRenderer.send('update-check-request')
				break
			}
			case 1: {
				ipcRenderer.send('download-update')
				this.setState({ isUpdating: true })
				break
			}
			case 5: {
				ipcRenderer.send('restart-and-install')
				break
			}
		}
	}

	handleStatusUpdate(_, data) {
		let updateStatus = data.status
		let buttonText = data.message
		let isUpdating = false
		let extraInfo = data.err || data.progressObj || ''
		if(updateStatus==0 || updateStatus==4) {
			isUpdating = true
		}
		this.setState({ updateStatus, buttonText, isUpdating, extraInfo })
	}
}
