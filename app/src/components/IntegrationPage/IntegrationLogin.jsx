import React, { Component } from 'react'
import { browserLink } from '../../util/util';
import { connect } from 'react-redux'

class IntegrationLogin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user: '',
			pass: '',
			loggingIn: false,
			loginstatus: 200
		}
		this.pclient = props.pclient
		this.handleUsernameChange = this.handleUsernameChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.MALLogin = this.MALLogin.bind(this)
	}
	
	render() {
		let { loggingIn, loginstatus } = this.state
		var formsClass = loggingIn ? 'disabled' : ''
		var loginButtonText = loggingIn ? 'logging in . . .' : (loginstatus == 401 ? 'invalid username or password' : loginstatus == 403 ? 'too many attempts, try again later' : (<i className="material-icons">chevron_right</i>))
		var loginButtonClass = 'mal-login-submit'
		loginButtonClass += loggingIn ? ' disabled' : ''
		loginButtonClass += loginstatus != 200 ? ' red disabled' : ''
		return (
			<div className="integration-login-wrapper">
				<div className="integration-login">
					<div className="login-title">Login</div>
					<div className="horizontal-spacer"/>
					<div className="register-button" onClick={() => {browserLink('https://myanimelist.net/register.php')}}><i className="material-icons">person_add</i></div>
					<div className="MAL-button" onClick={() => {browserLink('https://myanimelist.net/')}}/>
					<form className="creds-form" onSubmit={this.MALLogin}>
						<input type="text" className={formsClass} placeholder="username" onChange={this.handleUsernameChange}/>
						<input type="password" className={formsClass} placeholder="password" onChange={this.handlePasswordChange}/>
						<button type="submit" value="submit" className={loginButtonClass}>{loginButtonText}</button>
					</form>
				</div>
			</div>
		)
	}

	handleUsernameChange(e) {
		this.setState({ user: e.target.value, loginstatus: 200 })
	}

	handlePasswordChange(e) {
		this.setState({ pass: e.target.value, loginstatus: 200 })
	}

	MALLogin(e) {
		e.preventDefault()
		e.stopPropagation()
		this.setState({ loggingIn: true, loginstatus: 200 })
		let { user, pass } = this.state
		this.pclient.setUser(user, pass)
		let loginstatus
		this.pclient.verifyAuth().then(res => {
			console.log('Logged in as '+res.username)
			loginstatus = 200
			this.setState({ loggingIn: false, loginstatus })
			global.estore.set('mal', {
				user: this.state.user,
				pass: this.state.pass
			})
			this.props.setClient(this.pclient)
			window.location.hash = '#/integration/animelist'             
		}).catch(err => {
			if(err.statusCode==401) {
				console.log('Incorrect Username or Password!')
				loginstatus = 401
			} else if(err.statusCode==403) {
				console.log('Too many failed attempts!')
				loginstatus = 403
			}
			this.setState({ loggingIn: false, loginstatus })                        
		})
	}
}

const mapStateToProps = state => {
	return {
		pclient: state.animelistReducer.pclient
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setClient: pclient => dispatch({
			type: 'SET_CLIENT',
			payload: {
				pclient: pclient
			}
		})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationLogin)