import React from 'react'
const { dialog } = require('electron').remote
import { fixDirPath } from '../../util/util.js'

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
                        <div className="settings-item-content1" onClick={this.changeDownloadsPath.bind(this)}>
                            {this.state.downloadsPath}
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

}