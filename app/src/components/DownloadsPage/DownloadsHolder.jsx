import React, { Component } from 'react'
import { connect } from 'react-redux'
import DownloadCard from './DownloadCard.jsx'


class DownloadsHolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listView: 'COMPACT'
        }
        this.setListView = this.setListView.bind(this)
    }
    
    render() {
        var dlArray = []
        var alldlPropsArray = [...this.props.downloadsArray, ...this.props.completedArray]
        let { listView } = this.state
        if(alldlPropsArray.length) {
            alldlPropsArray.forEach(el => {
                if(this.props.completedArray.includes(el)) {
                    if(!el.props.persistedState) { //legacy support
                        var persistedState = {
                            totalSize: el.props.totalSize,
                            elapsed: el.props.elapsed,
                            completeDate: el.props.completeDate
                        }
                    }
                    dlArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} completed="true" key={el.props.animeFilename} persistedState={el.props.persistedState || persistedState} viewType={listView}/>)
                } else {
                    dlArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} key={el.props.animeFilename} persistedState={el.props.persistedState} viewType={listView}/>)
                }
            })
        }
        return (
        <div className="downloads-holder">
            <div className="sort-area"> 
                <div className="spacer-horizontal"/>
                <div viewvalue="COMPACT" className={`view-mode square${listView == 'COMPACT'?' view-mode-active':''}`} onClick={this.setListView}><i className="material-icons">view_headline</i></div>
                <div viewvalue="ROWS" className={`view-mode square${listView == 'ROWS'?' view-mode-active':''}`} onClick={this.setListView}><i className="material-icons">view_list</i></div>
            </div>
            {dlArray}
        </div>
        )
    }

    setListView(e) {
        var listView = e.target.getAttribute("viewvalue")
        this.setState({ listView })
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