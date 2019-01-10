import React from 'react'

import AboutUpdates from './AboutUpdates.jsx'

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
						<AboutUpdates/>
					</div>
				</div>
			</div>
		)
	}
}