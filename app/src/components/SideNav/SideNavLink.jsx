import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class SideNavLink extends Component {
  render() {
    return (
      <NavLink to={this.props.linkTarget} className="side-nav-link" activeClassName="side-nav-link-active">
        <i className="material-icons">{this.props.icon}</i>{this.props.label}
      </NavLink>
    )
  }
}
