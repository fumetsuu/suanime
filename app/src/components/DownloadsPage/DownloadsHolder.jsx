import React, { Component } from 'react'
import { connect } from 'react-redux'
import { streamMoe } from '../../util/animeDownloaders.js'
import DownloadCard from './DownloadCard.jsx'


class DownloadsHolder extends Component {
    render() {
        return (
        <div className="downloads-holder">
            {this.props.downloadsArray}
        </div>
        )
    }
}


//can handle speed and network data within this component using props, only use redux for link and name.
const mapStateToProps = state => {
    console.log('mapstate', state)
  return {
    downloadsArray: state.downloadsReducer.downloadsArray,
    epLink: state.downloadsReducer.epLink,
    animeFilename: state.downloadsReducer.animeFilename
  }
}

export default connect(mapStateToProps)(DownloadsHolder)