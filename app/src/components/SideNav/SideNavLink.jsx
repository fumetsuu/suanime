import React, { Component } from 'react'

export default class SideNavLink extends Component {
  render() {
    return (
      <div className="side-nav-link">
        <i className="material-icons">{this.props.icon}</i>{this.props.label}
      </div>
    )
  }
}
