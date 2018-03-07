import React from 'react'

export default class AboutContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            downloadsPath: global.estore.get('downloadsPath')
        }
    }
    
    render() {
        return(
        <div className="about-wrapper">
            <div className="about-container">
                <div className="about-header">About</div>
                <div className="about">
                    Version: {require('electron').remote.app.getVersion()}
                </div>
            </div>
        </div>
        )
    }
}