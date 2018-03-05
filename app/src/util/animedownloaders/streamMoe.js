const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const request = require('request')
const progress = require('request-progress')
const bytes = require('bytes')
import { convertSec } from '../util.js'
import { completeDL } from '../../actions/actions.js'
import store from '../../store.js'

export function streamMoe() {
    //bind variables to this object to be used for re renders
    this.setArgs = (passedmasteraniWatchURL, passedanimeFilename, updateFunc) => {
        this.masteraniWatchURL = passedmasteraniWatchURL
        this.animeFilename = passedanimeFilename
        this.slug = passedmasteraniWatchURL.split("watch/")[1].split("/")[0]
        this.epNumber = passedmasteraniWatchURL.split("watch/")[1].split("/")[1]
        this.updateFunc = updateFunc
    }
    //initial state for download card
    this.heldState = {
        status: "NOT_STARTED",
        speed: "0 B/s",
        progressSize: "0MB",
        totalSize: "0MB",
        percentage: 0,
        elapsed: 0,
        remaining: 0
    }
    //fix re render to update the component's UI
    this.fixComp = updateFunc => {
        this.updateFunc = updateFunc
    }
    //call the update function from DownloadCard
    this.updateState = () => {
        this.updateFunc(this.heldState)
    }
    //start downloading, searches stream.moe first, then mp4upload
    this.start = () => {
        this.heldState.status = 'STARTING_DOWNLOAD'
        this.updateState()
        this.closed = false
        rp(this.masteraniWatchURL)
            .then(body => {
                var streamdataformat = /var args = (.*)/g
                var match = streamdataformat.exec(body)
                var streamdata = JSON.parse(
                    match[0]
                        .split('args = ')[1]
                        .replace(/anime: {/, '"anime": {')
                        .replace(/mirrors: \[/, '"mirrors": [')
                        .replace(/auto_update: \[/, '"auto_update": [')
                )

                this.getStreamMoeURL(streamdata, (err, url) => {
                    if(err == 'NOT_FOUND') {
                        this.getmp4UploadURL(this.slug, this.epNumber, (err, url) => {
                            if(err) {
                                this.heldState.status = "ERROR"
                                this.updateState()
                            } else {
                                this.download(url)                                
                            }
                        })
                    } else if(err && err != 'NOT_FOUND') {
                        this.heldState.status = "ERROR"
                        this.updateState()
                    } else {
                        this.download(url)
                    }
                })

            })
            .catch(err => console.log(err))

        this.getStreamMoeURL = (streamdata, cb) => {
            var workingMirror = streamdata.mirrors.find(mirror => mirror.host_id == 19 && mirror.quality == 480)
            if(!workingMirror) {
                cb('NOT_FOUND', null)
                return                 
            }
            var embedURL = 'https://stream.moe/' + workingMirror.embed_id
            rp(embedURL).then(body => {
                var moeParser = new DOMParser()
                var downloadURL = moeParser.parseFromString(body, "text/html").querySelector('.first ~ td > a').getAttribute('href')
                cb(null, downloadURL)
                return
            }, err => {
                if(err) {
                    cb(err, null)
                    return
                }
            })
        }

        this.getmp4UploadURL = (slug, epNumber, cb) => {
            var corsageURL = `https://corsage-sayonara.herokuapp.com/masterani/api/video/?slug=${slug}&ep=${epNumber}`
            rp({uri: corsageURL, json: true }).then(mirrorsArray => {
                var downloadURL = mirrorsArray.find(mirror => mirror.id == 1).link
                cb(null, downloadURL)
                return
            }, err => {
                if(err) {
                    cb(err, null)
                    return
                }
            })
        }

        this.download = downloadURL => {
            var dlpath = global.estore.get('downloadPath') || path.join(__dirname, '../downloads/')
            var dlp = fs.createWriteStream(path.join(dlpath+this.animeFilename))
            this.dlReq = request(downloadURL)
            progress(this.dlReq, { throttle: 500 })
                .on('progress', (dlState => {              
                    if(dlState.time.remaining) {
                        this.heldState = {
                            status: 'DOWNLOADING',
                            speed: bytes(dlState.speed)+'/s',
                            progressSize: bytes(dlState.size.transferred),
                            totalSize: bytes(dlState.size.total),
                            percentage: (100*(dlState.percent)).toFixed(2),
                            elapsed: convertSec(Math.ceil((dlState.time.elapsed))),
                            remaining: convertSec(Math.ceil((dlState.time.remaining)))
                        }
                        this.updateState()
                    }
                })).on('error', err => {
                    this.heldState = {
                        status: "NETWORK_ERROR",
                        speed: "0 B/s",
                        progressSize: "0MB",
                        totalSize: "0MB",
                        percentage: 0,
                        elapsed: 0,
                        remaining: 0
                    }
                    this.updateState()
                    this.closed = true
                    this.dlReq.abort()
                }).on('end', () => {
                    if(!this.closed) {
                        this.heldState = {
                            status: 'COMPLETED',
                            speed: '',
                            progressSize: this.heldState.totalSize,
                            percentage: '100',
                            remaining: '0 sec',
                            elapsed: this.heldState.elapsed,
                            completeDate: new Date().toLocaleString()
                        }
                        this.updateState()
                        store.dispatch(
                            completeDL(this.animeFilename, this.heldState.progressSize, this.heldState.elapsed, this.heldState.completeDate)
                        )
                    }
                }).pipe(dlp)
        }
    }
    //close connection
    this.delete = () => {
        if(this.dlReq) {
            this.closed = true
            this.dlReq.abort()
        }
    }
    //pause download
    this.pause = () => {
        this.dlReq.pause()
        setTimeout(() => {
            this.heldState.status = 'PAUSED'
            this.updateState()
        }, 1000)

    }
    //resume download
    this.continue = () => {
        this.dlReq.resume()
    }
}

