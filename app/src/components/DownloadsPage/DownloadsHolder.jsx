import React, { Component } from 'react'
import { connect } from 'react-redux'
import DownloadCard from './DownloadCard.jsx'


class DownloadsHolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardsArray: [],
            empty: false,
            listView: 'COMPACT',
            listSort: 'DATE'
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
                <div sortvalue="TITLE" onClick={this.setListSort} className={`sort-by${/TITLE/.test(listSort)?' sort-by-active':''}`}>Title</div>
                <div sortvalue="DATE" onClick={this.setListSort} className={`sort-by${/DATE/.test(listSort)?' sort-by-active':''}`}>Date</div> 
                <div sortvalue="SIZE" onClick={this.setListSort} className={`sort-by${/SIZE/.test(listSort)?' sort-by-active':''}`}>Size</div>
                <div className="spacer-horizontal"/>
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
    }

    setListSort(e) {
        var listSort = e.target.getAttribute("sortvalue")
        if(this.state.listSort == listSort) {
            listSort = 'v'+listSort
        }
        this.setState({ listSort }, () => {
            this.updateDisplay()
        })
    }

    updateDisplay(passedProps) {
        var props = passedProps ? passedProps : this.props
        var cardsArray = []
        var alldlPropsArray = [...props.downloadsArray, ...props.completedArray]
        if(!alldlPropsArray.length) {
            this.setState({ empty: true })
        }
        let { listView, listSort } = this.state
        var orderA = -1, orderB = 1
        if(listSort[0] == 'v') {
            orderA = 1, orderB = -1
        }
        switch(listSort) {
            case 'TITLE': case 'vTITLE': {
                alldlPropsArray = alldlPropsArray.sort((a1, a2) => {
                    return a1.props.animeName <= a2.props.animeName ? orderA : orderB
                })
                break
            }
            case 'DATE': case 'vDATE': {
                alldlPropsArray = alldlPropsArray.sort((a1, a2) => {
                    if(!a1.props.persistedState) {
                        var a1date = a1.props.completeDate
                    } else {
                        var a1date = a1.props.persistedState.completeDate
                    }
                    if(!a2.props.persistedState) {
                        var a2date = a2.props.completeDate
                    } else {
                        var a2date = a2.props.persistedState.completeDate
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
                    console.log(a1size, a2size)
                    return parseFloat(a1size) <= parseFloat(a2size) ? orderA : orderB
                })
                break
            }
        }
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