import React from 'react'
import Dropdown from 'react-dropdown'
const { dialog } = require('electron').remote

import Toggle from './Toggle.jsx'
import { maxDownloads } from './settingsOptionsData'
import { initialiseDB, setDownloaderSettings } from '../../util/estoreUtil';

export default class SettingsContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			downloadsPath: global.estore.get('downloadsPath'),
			maxConcurrentDownloads: global.estore.get('sudownloaderSettings').maxConcurrentDownloads || 4,
			usepagination: global.estore.get('usepagination'),
			autoStart: global.estore.get('sudownloaderSettings').autoStart,
			downloadHD: global.estore.get('downloadHD')
		}
	}
	
	render() {
		let { downloadsPath, maxConcurrentDownloads, usepagination, autoStart, downloadHD } = this.state
		return(
			<div className="settings-wrapper">
				<div className="settings-container">
					<div className="settings-header">Settings</div>
					<div className="settings">
						<div className="settings-item">
							<div className="settings-item-label dl-path" onClick={this.openDLFolder}>
								Downloads Path
							</div>
							<div className="settings-item-content settings-underline" onClick={this.changeDownloadsPath.bind(this)}>
								{downloadsPath}
							</div>
						</div>
						<div className="settings-item">
							<div className="settings-item-label">
								Anime Search
							</div>
							<div className="settings-item-content">
								<span className="label-text">Pagination:</span> <Toggle onToggle={this.changeSearchPagination.bind(this)} className="toggle-margin" toggleOn={usepagination}/>
							</div>
						</div>
						<div className="settings-item">
							<div className="settings-item-label">
								Download Settings
							</div>
							<div className="settings-item-content">
								<span className="label-text">Max concurrent downloads:</span> <Dropdown className="dropdown-options" options={maxDownloads()} onChange={this.changeMCD.bind(this)} value={maxDownloads().find(el => el.value == maxConcurrentDownloads)} placeholder="max concurrent downloads"/>
							</div>
							<div className="settings-item-content">
								<span className="label-text">Automatically start donwloads after queueing:</span> <Toggle onToggle={this.changeAutoStart.bind(this)} className="toggle-margin" toggleOn={autoStart}/>
							</div>
							<div className="settings-item-content">
								<span className="label-text">Download in highest quality:</span> <Toggle onToggle={this.changeDownloadHD.bind(this)} className="toggle-margin" toggleOn={downloadHD}/>
							</div>
						</div>
						<div className="settings-item">
							<div className="settings-item-label">
								Clear All Data
							</div>
							<div className="settings-item-content">
								<div className="red-bg DELETE" onClick={this.clearEverything.bind(this)}>Clear Everything</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	openDLFolder() {
		var dlfolder = global.estore.get('downloadsPath')
		require('electron').shell.openItem(dlfolder)
	}

	changeDownloadsPath() {
		dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: global.estore.get('downloadsPath') }, folderPath => {
			if(folderPath) {
				global.estore.set('downloadsPath', folderPath[0])
				this.setState({ downloadsPath: folderPath[0] })
			}
		})
	}

	changeSearchPagination() {
		global.estore.set('usepaginationsearch', !global.estore.get('usepaginationsearch'))
	}

	changeMCD(selected) {
		global.estore.set('sudownloaderSettings', Object.assign({}, global.estore.get('sudownloaderSettings'), { maxConcurrentDownloads: selected.value }))
		this.setState({ maxConcurrentDownloads: selected.value })
		setDownloaderSettings()
	}

	changeAutoStart() {
		global.estore.set('sudownloaderSettings', Object.assign({}, global.estore.get('sudownloaderSettings'), { autoStart: !global.estore.get('sudownloaderSettings').autoStart }))
		setDownloaderSettings()
	}

	changeDownloadHD() {
		global.estore.set('downloadHD', !global.estore.get('downloadHD'))
	}

	clearEverything() {
		if(confirm('Everything will be deleted, this action cannot be reverted. Are you sure?')) {
			global.estore.clear()
			initialiseDB()
			this.setState({
				downloadsPath: global.estore.get('downloadsPath'),
				maxConcurrentDownloads: 4,
				usepagination: false,
				autoStart: true,
				downloadHD: true
			})
		}
	}

}