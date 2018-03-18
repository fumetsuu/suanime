import React from 'react'
const { dialog } = require('electron').remote
import { fixDirPath } from '../../util/util.js'
import Dropdown from 'react-dropdown'

import Toggle from './Toggle.jsx'
import { maxDownloads } from './settingsOptionsData'

var eStore = require('electron-store')
global.estore = new eStore()

export default class SettingsContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            downloadsPath: global.estore.get('downloadsPath'),
            maxConcurrentDownloads: global.estore.get('sudownloaderSettings').maxConcurrentDownloads || 4
        }
    }
    
    render() {
        return(
        <div className="settings-wrapper">
            <div className="settings-container">
                <div className="settings-header">Settings</div>
                <div className="settings">
                    <div className="settings-item">
                        <div className="settings-item-label">
                            Downloads Path
                        </div>
                        <div className="settings-item-content settings-underline" onClick={this.changeDownloadsPath.bind(this)}>
                            {this.state.downloadsPath}
                        </div>
                    </div>
                    <div className="settings-item">
                        <div className="settings-item-label">
                            Anime Search
                        </div>
                        <div className="settings-item-content">
                            <span className="label-text">Pagination:</span> <Toggle onToggle={this.changeSearchPagination.bind(this)} className="toggle-margin" toggleOn={global.estore.get('usepaginationsearch')}/>
                        </div>
                    </div>
                    <div className="settings-item">
                        <div className="settings-item-label">
                            Download Settings
                        </div>
                        <div className="settings-item-content">
                            <span className="label-text">Max concurrent downloads:</span> <Dropdown className="dropdown-options" options={maxDownloads()} onChange={this.changeMCD.bind(this)} value={maxDownloads().find(el => el.value == this.state.maxConcurrentDownloads)} placeholder="max concurrent downloads"/>
                        </div>
                        <div className="settings-item-content">
                            <span className="label-text">Automatically start queueing:</span> <Toggle onToggle={this.changeAutoQueue.bind(this)} className="toggle-margin" toggleOn={global.estore.get('sudownloaderSettings').autoQueue}/>
                        </div>
                        <div className="settings-item-content">
                            <span className="label-text">Automatically start downloading on startup:</span> <Toggle onToggle={this.changeAutoStart.bind(this)} className="toggle-margin" toggleOn={global.estore.get('sudownloaderSettings').autoStart}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
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
        if(global.estore.get('usepaginationsearch')) {
            global.estore.set('usepaginationsearch', !global.estore.get('usepaginationsearch'))
        } else {
            global.estore.set('usepaginationsearch', true)
        }
    }

    changeMCD(selected) {
        global.estore.set('sudownloaderSettings', Object.assign({}, global.estore.get('sudownloaderSettings'), { maxConcurrentDownloads: selected.value }))
        this.setState({ maxConcurrentDownloads: selected.value })
    }

    changeAutoQueue() {
        global.estore.set('sudownloaderSettings', Object.assign({}, global.estore.get('sudownloaderSettings'), { autoQueue: !global.estore.get('sudownloaderSettings').autoQueue }))
    }

    changeAutoStart() {
        global.estore.set('sudownloaderSettings', Object.assign({}, global.estore.get('sudownloaderSettings'), { autoStart: !global.estore.get('sudownloaderSettings').autoStart }))
    }

}