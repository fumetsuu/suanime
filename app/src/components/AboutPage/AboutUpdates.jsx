import React, { Component } from 'react'
const { ipcRenderer } = require('electron')

export default class AboutUpdates extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateStatus: -1,
            buttonText: 'Check for updates',
            isUpdating: false,
            extraInfo: ''
        }
    }
    
    componentDidMount() {
        ipcRenderer.on('update-status', (e, data) => {
            let updateStatus = data.status
            let buttonText = data.message
            let isUpdating = false
            let extraInfo = JSON.stringify(data.err) || JSON.stringify(data.progressObj) || ''
            if(updateStatus==0 || updateStatus==4) {
                console.log(data)
                isUpdating = true
            }
            this.setState({ updateStatus, buttonText, isUpdating, extraInfo })
        })
    }

    render() {
        let { updateStatus, buttonText, isUpdating, extraInfo } = this.state
        return (
        <div className="about-updates">
            <div className="version">Version: <b>{require('electron').remote.app.getVersion()}</b></div>
            <div className="check-for-updates" onClick={this.checkForUpdates.bind(this)}>{buttonText}</div>
            <div className="update-progress-container">
                {extraInfo}
            </div>
        </div>
        )
    }

    checkForUpdates() {
        ipcRenderer.send('update-check-request')
    }
}
