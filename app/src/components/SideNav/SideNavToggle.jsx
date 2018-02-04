import React, { Component } from 'react'
import { connect } from 'react-redux'
const toggableHashes = ["#/watch"]

const SideNavToggle = (props) => {
    return (
      <div className="side-nav-toggle" onClick={props.toggle} style={{left: props.toggleLeft}}>
        <i className="material-icons">{props.toggleIcon}</i>
      </div>
    )
}

const mapDispatchToProps = dispatch => {
  return {
    toggle: () => {
      if(toggableHashes.includes(window.location.hash)) {
        dispatch({
          type: 'TOGGLE_SIDENAV'
          })
      } else {
        console.log("cant close sidenav on this windowd")
      }
    }
  }
}

export default connect(null, mapDispatchToProps)(SideNavToggle)