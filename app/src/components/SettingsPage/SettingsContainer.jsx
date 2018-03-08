import React from 'react'
const { dialog } = require('electron').remote
import { fixDirPath } from '../../util/util.js'

import Toggle from './Toggle.jsx'

var eStore = require('electron-store')
global.estore = new eStore()

export default class SettingsContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            downloadsPath: global.estore.get('downloadsPath')
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
                            Pagination: <Toggle onToggle={this.changeSearchPagination.bind(this)} className="toggle-margin" toggleOn={global.estore.get('usepaginationsearch')}/>
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
        console.log(global.estore.get('usepaginationsearch'))
        if(global.estore.get('usepaginationsearch')) {
            global.estore.set('usepaginationsearch', !global.estore.get('usepaginationsearch'))
        } else {
            global.estore.set('usepaginationsearch', true)
        }
        console.log(global.estore.get('usepaginationsearch'))
    }

}