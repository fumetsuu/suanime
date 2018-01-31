import React, { Component } from 'react'

import Title from './Title.jsx'
import SideNavLink from './SideNavLink.jsx'
import SideNavToggle from './SideNavToggle.jsx'

export default class SideNav extends Component {
  constructor() {
    super()
    
  }

  render() {
    return (
      <div className="side-nav">
        <Title/>
        <SideNavLink icon="file_download" label="Downloads" linkTarget="/downloads"/>
        <SideNavLink icon="merge_type" label="Integration" linkTarget="/downloads"/>
        <div className="spacer-vertical"/>
        <SideNavToggle/>
        <SideNavLink icon="settings" label="Settings" linkTarget="/settings"/>
        <SideNavLink icon="info" label="About" linkTarget="/about"/>
      </div>
    )
  }
}
