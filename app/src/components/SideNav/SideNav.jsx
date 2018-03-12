import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import SideNavLink from './SideNavLink.jsx'
import SideNavToggle from './SideNavToggle.jsx'
import { sidenavhide, sidenavtoggle, sidenavshow } from '../../util/sidenavtoggle.js'
const toggableHashes = ["#/watch", "#/info"]

class SideNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showToggle: toggableHashes.some(el => window.location.hash.includes(el))
    }
    window.addEventListener('hashchange', () => {
      console.log(window.location.hash)
      let toggable = toggableHashes.some(el => window.location.hash.includes(el))
      this.setState({
        showToggle: toggable
      })
      if(toggable) {
        sidenavhide()
      } else {
        sidenavshow()
      }
    })
  }

  render() {
    let props = this.props
    let sideWidth = props.show ? '250px' : '0'
    let toggleLeft = props.show ? '222px' : '-20px'
    let toggleIcon = props.show ? 'chevron_left' : 'chevron_right'
    let watchDisabled = props.watching ? false : true
    return (
      <div className="side-nav" style={{ width: sideWidth }}>
        <NavLink exact to="/" className="title">
          <span className="su-blue">SU</span> ANIME
        </NavLink>
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