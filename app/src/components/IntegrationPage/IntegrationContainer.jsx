import React, { Component } from 'react'

import IntegrationLogin from './IntegrationLogin.jsx'

export default class IntegrationContainer extends Component {
  render() {
    return (
      <div className="integration-wrapper">
        <div className="integration-container">
            <IntegrationLogin/>
        </div>
      </div>
    )
  }
}
