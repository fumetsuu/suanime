import React from 'react'
import { NavLink } from 'react-router-dom'

const SideNavLink = (props) => {
  var linkClassName = props.small ? 'small' : 'side-nav-link'
  linkClassName+=props.disabled?' disabled':''
  return (
    <NavLink to={props.linkTarget} className={linkClassName} activeClassName="side-nav-link-active">
    <i className="material-icons">{props.icon}</i>{props.label}
    </NavLink>
  )
}

export default SideNavLink
