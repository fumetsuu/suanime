import React, { Component } from 'react'
import { connect } from 'react-redux'
import DownloadCard from './DownloadCard.jsx'


class DownloadsHolder extends Component {
    render() {
        var dlArray = []
        var alldlPropsArray = [...this.props.downloadsArray, ...this.props.completedArray]
        if(alldlPropsArray.length) {
            alldlPropsArray.forEach(el => {
                if(this.props.completedArray.includes(el)) {
                    dlArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} completed="true" totalSize={el.props.totalSize} completeDate={el.props.completeDate} elapsed={el.props.elapsed} key={el.props.animeFilename} />)
                } else {
                    dlArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} key={el.props.animeFilename}/>)
                }
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
    downloadsArray: state.downloadsReducer.downloadsArray,
    completedArray: state.downloadsReducer.completedArray
  }
}

export default connect(mapStateToProps)(DownloadsHolder)