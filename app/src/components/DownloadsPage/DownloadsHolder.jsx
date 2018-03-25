import React, { Component } from 'react'
import { connect } from 'react-redux'
import DownloadCard from './DownloadCard.jsx'
import DownloadsFolder from './DownloadsFolder.jsx'
import { clearAllDownloads, persistDLState } from '../../actions/actions'

const suDownloader = require('../../suDownloader/suDownloader')

class DownloadsHolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardsArray: [],
            empty: false,
            listView: props.listView,
            listSort: props.listSort
        }
        this.setListView = this.setListView.bind(this)
        this.setListSort = this.setListSort.bind(this)
    }

    componentDidMount() {
        this.updateDisplay()
    }

    componentWillReceiveProps(nextProps) {
        this.updateDisplay(nextProps)
    }
    
    
    render() {
        if(this.state.empty) {
            return <div className="downloads-holder"><div className="no-downloads">No downloads!</div></div>
        }
        let { listView, listSort, cardsArray } = this.state
        return (
        <div className="downloads-holder">
            <div className="sort-area"> 
                <div className="sort-by" onClick={this.startQueue}>Start Queue</div>
                <div className="sort-by" onClick={this.stopQueue}>Stop Queue</div>
                <div className="sort-by" onClick={this.clearAll.bind(this)}>Clear All</div>
                <div className="spacer-horizontal"/>
                <div sortvalue="TITLE" onClick={this.setListSort} className={`sort-by${/TITLE/.test(listSort)?' sort-by-active':''}`}>Title</div>
                <div sortvalue="ADDED" onClick={this.setListSort} className={`sort-by${/ADDED/.test(listSort)?' sort-by-active':''}`}>Date Added</div> 
                <div sortvalue="DATE" onClick={this.setListSort} className={`sort-by${/DATE/.test(listSort)?' sort-by-active':''}`}>Date Completed</div> 
                <div sortvalue="SIZE" onClick={this.setListSort} className={`sort-by${/SIZE/.test(listSort)?' sort-by-active':''}`}>Size</div>
                <div viewvalue="COMPACT" className={`view-mode square${listView == 'COMPACT'?' view-mode-active':''}`} onClick={this.setListView}><i className="material-icons">view_headline</i></div>
                <div viewvalue="ROWS" className={`view-mode square${listView == 'ROWS'?' view-mode-active':''}`} onClick={this.setListView}><i className="material-icons">view_list</i></div>
            </div>
            {cardsArray}
        </div>
        )
    }

    setListView(e) {
        var listView = e.target.getAttribute("viewvalue")
        this.setState({ listView }, () => {
            this.updateDisplay()
        })
        this.props.persistDLState(listView, this.state.listSort)
    }

    setListSort(e) {
        var listSort = e.target.getAttribute("sortvalue")
        if(this.state.listSort == listSort) {
            listSort = 'v'+listSort
        }
        this.setState({ listSort }, () => {
            this.updateDisplay()
        })
        this.props.persistDLState(this.state.listView, listSort)
    }

    updateDisplay(passedProps) {
        var props = passedProps ? passedProps : this.props
        var cardsArray = []
        var alldlPropsArray = [...props.downloadsArray, ...props.completedArray]
        var unchangedPropsArray = [...props.downloadsArray, ...props.completedArray]
        if(!alldlPropsArray.length) {
            this.setState({ empty: true })
            return false
        }
        let { listView, listSort } = this.state
        var orderA = -1, orderB = 1
        if(listSort[0] == 'v') {
            orderA = 1, orderB = -1
        }
        switch(listSort) {
            case 'TITLE': case 'vTITLE': {
                console.log(alldlPropsArray)
                alldlPropsArray = alldlPropsArray.sort((a1, a2) => {
                    if(a1.props.animeName == a2.props.animeName) {
                        var a1ep = parseInt(a1.props.epTitle.split('Episode ')[1])
                        var a2ep = parseInt(a2.props.epTitle.split('Episode ')[1])
                        return a1ep <= a2ep ? orderA : orderB
                    }
                    return a1.props.animeName <= a2.props.animeName ? orderA : orderB
                })
                break
            }
            case 'ADDED': case 'vADDED': {
                alldlPropsArray = alldlPropsArray.sort((a1, a2) => {
                    var a1added = a1.props.started || 0
                    var a2added = a2.props.started || 0
                    return a1added <= a2added ? orderA : orderB
                })
                break
            }
            case 'DATE': case 'vDATE': {
                alldlPropsArray = alldlPropsArray.sort((a1, a2) => {
                    if(!a1.props.persistedState) {
                        var a1date = a1.props.completeDate || unchangedPropsArray.indexOf(a1)
                    } else {
                        var a1date = a1.props.persistedState.completeDate || unchangedPropsArray.indexOf(a1)
                    }
                    if(!a2.props.persistedState) {
                        var a2date = a2.props.completeDate || unchangedPropsArray.indexOf(a2)
                    } else {
                        var a2date = a2.props.persistedState.completeDate || unchangedPropsArray.indexOf(a2)
                    }
                    return a1date <= a2date ? orderA : orderB
                })
                break
            }
            case 'SIZE': case 'vSIZE': {
                alldlPropsArray = alldlPropsArray.sort((a1, a2) => {
                    if(!a1.props.persistedState) {
                        var a1size = a1.props.totalSize
                    } else {
                        var a1size = a1.props.persistedState.progressSize
                    }
                    if(!a2.props.persistedState) {
                        var a2size = a2.props.totalSize
                    } else {
                        var a2size = a2.props.persistedState.progressSize
                    }
                    return parseFloat(a1size) > parseFloat(a2size) ? orderA : orderB
                })
                break
            }
        }
        if(listView == 'ROWS') { this.updateDisplayRows(alldlPropsArray); return true }
        if(alldlPropsArray.length) {
            alldlPropsArray.forEach(el => {
                if(props.completedArray.includes(el)) {
                    if(!el.props.persistedState) { //legacy support
                        var persistedState = {
                            totalSize: el.props.totalSize,
                            elapsed: el.props.elapsed,
                            completeDate: el.props.completeDate
                        }
                    }
                    cardsArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} completed="true" key={el.props.animeFilename} persistedState={el.props.persistedState || persistedState} viewType={listView}/>)
                } else {
                    cardsArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} key={el.props.animeFilename} persistedState={el.props.persistedState} viewType={listView}/>)
                }
            })
        }
        this.setState({ cardsArray })
    }

    updateDisplayRows(allprops) {
        var titlesDictionary = []
        allprops.forEach(el => {
            var dictionaryIdx = titlesDictionary.findIndex(el1 => el1.animeName == el.props.animeName)
            if(dictionaryIdx == -1) {
                titlesDictionary.push({ animeName: el.props.animeName, posterImg: el.props.posterImg, episodes: [el] })
            } else {
                titlesDictionary[dictionaryIdx].episodes.push(el)
            }
        })
        var cardsArray = []
        titlesDictionary.forEach(el => {
            if(el.episodes.length > 1) {
                el.episodes.sort((a, b) => {
                    var aep = parseInt(a.props.epTitle.split('Episode ')[1])
                    var bep = parseInt(b.props.epTitle.split('Episode ')[1])
                    return aep <= bep ? -1 : 1
                })
            }
            cardsArray.push(<DownloadsFolder key={el.animeName} data={el} completedArray={this.props.completedArray}/>)
        })
        console.log(titlesDictionary)
        this.setState({ cardsArray })
    }

    startQueue() {
        suDownloader.startQueue()
    }

    stopQueue() {
        suDownloader.stopQueue()
    }

    clearAll() {
        suDownloader.clearAll()
        this.props.clearAllDownloads()
    }
}


//can handle speed and network data within this component using props, only use redux for link and name.
//react components aren't stored in estore, only props
const mapStateToProps = state => {
  return {
    downloadsArray: state.downloadsReducer.downloadsArray,
    completedArray: state.downloadsReducer.completedArray,
    listView: state.downloadsReducer.persistedDLState.listView,
    listSort: state.downloadsReducer.persistedDLState.listSort
  }
}

const mapDispatchToProps = dispatch => {
    return {
        clearAllDownloads: () => dispatch(clearAllDownloads()),
        persistDLState: (listView, listSort) => dispatch(persistDLState(listView, listSort))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsHolder)