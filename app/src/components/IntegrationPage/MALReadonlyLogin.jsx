import React, { Component } from 'react'

export default class MALReadonlyLogin extends Component {
	constructor(props) {
		super(props)
		this.state = { user: '' }
		
		this.handleUsernameChange = this.handleUsernameChange.bind(this)
		this.MALLogin = this.MALLogin.bind(this)
	}

	render() {
		return (
			<div className="integration-login-wrapper">
				<div className="integration-login">
					<div className="login-title">View List</div>
					<div className="horizontal-spacer"/>
					<div className="MAL-button" onClick={() => {browserLink('https://myanimelist.net/')}}/>
					<form className="creds-form" onSubmit={this.MALLogin}>
						<input type="text" placeholder="username" onChange={this.handleUsernameChange}/>
						<button type="submit" value="submit" className="mal-login-submit"><i className="material-icons">chevron_right</i></button>
					</form>
				</div>
			</div>
		)
	}

	handleUsernameChange(e) {
		this.setState({ user: e.target.value })
	}

	MALLogin(e) {
		e.preventDefault()
		e.stopPropagation()
		let { user } = this.state
		global.estore.set('mal-readonly', user)
		window.location.hash = '#/integration/animelist'             
	}
}
