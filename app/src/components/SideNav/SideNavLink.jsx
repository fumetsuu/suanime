import React from 'react'
import { NavLink } from 'react-router-dom'

const SideNavLink = (props) => {
  var linkClassName
  if(props.linkTarget=="/watch" && props.disabled==='true') {
    linkClassName="side-nav-link disabled"
} else {
    linkClassName="side-nav-link"
  }
  return (
    <NavLink to={props.linkTarget} className={linkClassName} activeClassName="side-nav-link-active">
    <i className="material-icons">{props.icon}</i>{props.label}
    </NavLink>
  )
}

export default SideNavLink
