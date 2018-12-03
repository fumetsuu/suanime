import React, { Component } from 'react'
const fs = require('fs')
const path = require('path')
const bytes = require('bytes')
import DownloadCard from './DownloadCard.jsx'
import { genFolderPath, promisefsStat, fixFilename } from '../../util/util';
import { loadMAImage } from '../../util/maImageLoader.js';

export default class DownloadsFolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardsArray: [],
            extraInfo: 'Calculating Local Stats...',
            open: false,
            cposter: ''
        }
    }

    componentWillMount() {
        loadMAImage(this.props.data.posterImg).then(imgData => {
            this.setState({ cposter: imgData })
        }).catch(console.log)
    }

    componentDidMount() {
        this.infoTO = setTimeout(this.getExtraInfo.bind(this), 1)  //faster load time
    }

    componentWillUnmount() {
        clearTimeout(this.infoTO)
    }
    
    render() {
        let { cardsArray, open } = this.state
        return (
            <div className="downloads-folder">
                <div className={open ? "folder-container active" : "folder-container"} onClick={this.openFolder.bind(this)}>
                    <div className="folder-img" style={{ backgroundImage: `url('data:image/jpeg;base64,${this.state.cposter}')` }} />
                    <div className="folder-info">
                        <div className="folder-title">{this.props.data.animeName}</div>
                        <div className="folder-data">{this.state.extraInfo}</div>
                    </div>
                </div>
                <div className={open ? "folder-contents" : "closed"}>
                    {open ? cardsArray : null}
                </div>
            </div>
        )
    }

    openFolder() {
        let seriesArray = this.props.data
        var cardsArray = []
        seriesArray.episodes.forEach(el => {
            if(this.props.completedArray.includes(el)) {
                if(!el.props.persistedState) { //legacy support
                    var persistedState = {
                        totalSize: el.props.totalSize,
                        elapsed: el.props.elapsed,
                        completeDate: el.props.completeDate
                    }
                }
                cardsArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} completed="true" key={el.props.animeFilename} persistedState={el.props.persistedState || persistedState} viewType="ROWS"/>)
            } else {
                cardsArray.push(<DownloadCard epLink={el.props.epLink} animeFilename={el.props.animeFilename} posterImg={el.props.posterImg} animeName={el.props.animeName} epTitle={el.props.epTitle} key={el.props.animeFilename} persistedState={el.props.persistedState} viewType="ROWS"/>)
            }
        })
        this.setState({ cardsArray, open: !this.state.open })
    }

    getExtraInfo() {
        var { animeName } = this.props.data
        var folder = genFolderPath(animeName)
        var availableEps = [], folderSize = 0, fileCount = 0
        fs.readdir(folder, (err, files) => {
            if(err) { console.log(err); return false }
            files.forEach(file => {
                if(file.endsWith('.mp4')) {
                    fileCount++
                    availableEps.push(parseInt(file.split(`${fixFilename(animeName)} - `)[1]))
                }
            })
            Promise.all(files.map(file => promisefsStat(path.join(folder, file)))).then(stats => {
                stats.forEach(stat => {
                    folderSize += stat.size
                })
                var extraInfo = `File count: ${fileCount} \u2003\u2003  Available Episodes: [${availableEps.sort((a, b) => a < b ? -1 : 1).join(', ')}] \u2003\u2003 Folder Size: ${bytes(folderSize)}`
                this.setState({ extraInfo })
            })
        })
    }
}
