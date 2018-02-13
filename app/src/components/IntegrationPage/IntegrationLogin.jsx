import React, { Component } from 'react'

export default class IntegrationLogin extends Component {
  render() {
    return (
        <div className="integration-login-wrapper">
            <div className="integration-login">
                <div className="login-title">Login</div>
                <div className="horizontal-spacer"/>
                <div className="register-button"><i className="material-icons">person_add</i></div>
                <div className="MAL-button"/>
                <form className="creds-form">
                    <input type="text" className="username-text" placeholder="username"/>
                    <input type="password" className="password-text" placeholder="password"/>
                    <button type="submit" value="submit" className="mal-login-submit"><i className="material-icons">chevron_right</i></button>
                </form>
            </div>
        </div>
    )
  }
}
