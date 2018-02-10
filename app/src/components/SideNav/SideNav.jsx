import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Title from './Title.jsx'
import SideNavLink from './SideNavLink.jsx'
import SideNavToggle from './SideNavToggle.jsx'
const toggableHashes = ["#/watch"]

class SideNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showToggle: toggableHashes.includes(window.location.hash)
    }
    window.addEventListener('hashchange', () => {
      this.setState({
        showToggle: toggableHashes.includes(window.location.hash)
      })
    })
  }

  render() {
    var props = this.props
    var sideWidth = props.show ? '250px' : '0'
    var toggleLeft = props.show ? '222px' : '-20px'
    var toggleIcon = props.show ? 'chevron_left' : 'chevron_right'
    var watchDisabled = props.watching ? 'false' : 'true'
    return (
      <div className="side-nav" style={{ width: sideWidth }}>
        <Title/>
        <SideNavLink icon="search" label="Search" linkTarget="/search"/>
        <SideNavLink icon="event" label="Seasonal" linkTarget="/seasonal"/>
        <SideNavLink icon="file_download" label="Downloads" linkTarget="/downloads"/>
        <SideNavLink icon="merge_type" label="Integration" linkTarget="/integration"/>
        <SideNavLink icon="live_tv" label="Watch" linkTarget="/watch" disabled={watchDisabled}/>
        <div className="spacer-vertical"/>
        {this.state.showToggle ? <SideNavToggle toggleLeft={toggleLeft} toggleIcon={toggleIcon}/> : ''}
        <div className="settings-about">
          <SideNavLink icon="settings" label="" linkTarget="/settings" small="true"/>
          <SideNavLink icon="info" label="" linkTarget="/about" small="true"/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    show: state.animeVideoReducer.showSideNav,
    watching: state.animeVideoReducer.watching
  }
}

export default withRouter(connect(mapStateToProps)(SideNav))