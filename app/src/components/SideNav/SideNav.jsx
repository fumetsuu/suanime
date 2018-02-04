import React, { Component } from 'react'
import { connect } from 'react-redux'

import Title from './Title.jsx'
import SideNavLink from './SideNavLink.jsx'
import SideNavToggle from './SideNavToggle.jsx'

const SideNav = (props) => {
  var sideWidth = props.show ? '250px' : '0'
  var toggleLeft = props.show ? '222px' : '-20px'
  var toggleIcon = props.show ? 'chevron_left' : 'chevron_right'
  console.log(sideWidth)
    return (
      <div className="side-nav" style={{ width: sideWidth }}>
        <Title/>
        <SideNavLink icon="file_download" label="Downloads" linkTarget="/downloads"/>
        <SideNavLink icon="merge_type" label="Integration" linkTarget="/integration"/>
        <div className="spacer-vertical"/>
        <SideNavToggle toggleLeft={toggleLeft} toggleIcon={toggleIcon}/>
        <SideNavLink icon="settings" label="Settings" linkTarget="/settings"/>
        <SideNavLink icon="info" label="About" linkTarget="/about"/>
      </div>
    )
}

const mapStateToProps = state => {
  return {
    show: state.animeVideoReducer.showSideNav
  }
}

export default connect(mapStateToProps)(SideNav)