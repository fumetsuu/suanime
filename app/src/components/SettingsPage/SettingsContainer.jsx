import React from 'react'
const { dialog } = require('electron').remote
import { fixDirPath } from '../../util/util.js'
import Dropdown from 'react-dropdown'

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
            autoQueue: global.estore.get('sudownloaderSettings').autoQueue,
            autoStart: global.estore.get('sudownloaderSettings').autoStart
        }
    }
    
    render() {
        let { downloadsPath, maxConcurrentDownloads, usepagination, autoQueue, autoStart } = this.state
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
                            <span className="label-text">Automatically start queueing:</span> <Toggle onToggle={this.changeAutoQueue.bind(this)} className="toggle-margin" toggleOn={autoQueue}/>
                        </div>
                        <div className="settings-item-content">
                            <span className="label-text">Automatically start downloading on startup:</span> <Toggle onToggle={this.changeAutoStart.bind(this)} className="toggle-margin" toggleOn={autoStart}/>
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
        setDownloaderSettings()
    }

    changeAutoQueue() {
        global.estore.set('sudownloaderSettings', Object.assign({}, global.estore.get('sudownloaderSettings'), { autoQueue: !global.estore.get('sudownloaderSettings').autoQueue }))
        setDownloaderSettings()
    }

    changeAutoStart() {
        global.estore.set('sudownloaderSettings', Object.assign({}, global.estore.get('sudownloaderSettings'), { autoStart: !global.estore.get('sudownloaderSettings').autoStart }))
        setDownloaderSettings()
    }

    clearEverything() {
        if(confirm('Everything will be deleted, this action cannot be reverted. Are you sure?')) {
            global.estore.clear()
            initialiseDB()
            this.setState({
                downloadsPath: global.estore.get('downloadsPath'),
                maxConcurrentDownloads: 4,
                usepagination: false,
                autoQueue: true,
                autoStart: true
            })
        }
    }

}