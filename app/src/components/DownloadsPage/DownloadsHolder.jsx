import React, { Component } from 'react'
import { connect } from 'react-redux'
import DownloadCard from './DownloadCard.jsx'


class DownloadsHolder extends Component {
    render() {
        var dlArray = []
        if(this.props.downloadsArray.length) {
            this.props.downloadsArray.forEach(el => {
                dlArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle}/>)
            })
        }
        return (
        <div className="downloads-holder">
            {dlArray}
        </div>
        )
    }
}


//can handle speed and network data within this component using props, only use redux for link and name.
//react components aren't stored in estore, only props
const mapStateToProps = state => {
  return {
    downloadsArray: state.downloadsReducer.downloadsArray
  }
}

export default connect(mapStateToProps)(DownloadsHolder)