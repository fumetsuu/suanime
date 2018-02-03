import React, { Component } from 'react'
import { connect } from 'react-redux'
import DownloadCard from './DownloadCard.jsx'


class DownloadsHolder extends Component {
    render() {
        var dlArray = []
        console.log(this.props.downloadsArray, 'dl array')
        if(!this.props.downloadsArray.length && global.estore.get('storedDownloadsArray').length) {
            var temparray = global.estore.get('storedDownloadsArray')
            console.log('temp', temparray)
            temparray.forEach(el => {
                dlArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle}/>)
            })
        } else {
            dlArray = this.props.downloadsArray
        }
        console.log("new dl", dlArray)
        return (
        <div className="downloads-holder">
            {dlArray}
        </div>
        )
    }
}


//can handle speed and network data within this component using props, only use redux for link and name.
const mapStateToProps = state => {
    global.estore.set('storedDownloadsArray', [...global.estore.get('storedDownloadsArray'),...state.downloadsReducer.downloadsArray])
  return {
    downloadsArray: state.downloadsReducer.downloadsArray
  }
}

export default connect(mapStateToProps)(DownloadsHolder)