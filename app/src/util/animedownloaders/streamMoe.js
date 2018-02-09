const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const request = require('request')
const progress = require('request-progress')
const cheerio = require('cheerio')
const bytes = require('bytes')
import { convertSec } from '../util.js'
import store from '../../store.js'

export function streamMoe() {
    this.setArgs = (passedmasteraniWatchURL, passedanimeFilename, passedcomp) => {
        this.masteraniWatchURL = passedmasteraniWatchURL
        this.animeFilename = passedanimeFilename
        this.slug = passedmasteraniWatchURL.split("watch/")[1].split("/")[0]
        this.epNumber = passedmasteraniWatchURL.split("watch/")[1].split("/")[1]
        this.comp = passedcomp
    }
    this.heldState = {
        status: "NOT_STARTED",
        speed: "0 B/s",
        progressSize: "0MB",
        totalSize: "0MB",
        percentage: 0,
        elapsed: 0,
        remaining: 0
      }
    this.fixComp = comp => {
        this.comp = comp
    }
    this.updateState = () => {
        this.comp.setState(Object.assign({}, this.comp.state, this.heldState))
    }
    this.closed = false
    this.dlReq = null
    this.start = () => {
        this.heldState.status = "STARTING_DOWNLOAD"
        this.comp.setState(this.heldState)
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
                        console.log(err)
                        this.getmp4UploadURL(this.slug, this.epNumber, (err, url) => {
                            if(err == 'NOT_FOUND') {
                                this.heldState.status = "ERROR"
                                console.log("no mirror ", this.animeFilename)
                                console.log(err)
                            } else if(err && err != 'NOT_FOUND') {
                                this.heldState.status = "ERROR"
                                this.comp.setState(this.heldState)
                                console.log("probably an error on the video server's side mp4upload", err)
                            } else {
                                console.log(url)
                                this.download(url)                                
                            }
                        })
                    } else if(err && err != 'NOT_FOUND') {
                        this.heldState.status = "ERROR"
                        this.comp.setState(this.heldState)
                        console.log("probably an error on the video server's side streammoe", err)
                    } else {
                        this.download(url)
                    }
                })


            })
            .catch(err => console.log(err))

        this.getStreamMoeURL = (streamdata, cb) => {
            var workingMirror
            streamdata.mirrors.forEach(mirror => {
                if (mirror.host_id == 19 && mirror.quality == 480) {
                    workingMirror = mirror
                }
            })
            if(!workingMirror) {
                cb('NOT_FOUND', null)
                return false                 
            }
            workingMirror.host['link_url'] = 'https://stream.moe/'
            var embedURL = workingMirror.host.link_url + workingMirror.embed_id
            var downloadURL
            rp(embedURL).then(body => {
                var moeHTML = cheerio.load(body)
                downloadURL = moeHTML('.first ~ td > a').attr('href')
                cb(null, downloadURL)
                return true
            }, err => {
                if(err) {
                    cb(err, null)
                    return false
                }
            })
        }

        this.getmp4UploadURL = (slug, epNumber, cb) => {
            var corsageURL = `https://corsage-sayonara.herokuapp.com/masterani/api/video/?slug=${slug}&ep=${epNumber}`
            console.log(corsageURL)
            var downloadURL
            rp(corsageURL).then(mirrorsArray => {
                console.log(mirrorsArray)
                mirrorsArray = JSON.parse(mirrorsArray)
                mirrorsArray.forEach(mirror => {
                    console.log(mirror)
                    if(mirror.id == 1) {
                        downloadURL = mirror.link
                    }
                })
                cb(null, downloadURL)
                return true
            }, err => {
                if(err) {
                    cb(err, null)
                    return false
                }
            })
        }

        this.download = downloadURL => {
            var dlp = fs.createWriteStream(path.join(__dirname, '../downloads/'+this.animeFilename))
            this.dlReq = request(downloadURL)
            progress(this.dlReq, { throttle: 500 }).on('progress', (dlState => {                    
                if(!dlState.time.remaining) {} else {
                    this.heldState = {
                        status: 'DOWNLOADING',
                        speed: bytes(dlState.speed)+'/s',
                        progressSize: bytes(dlState.size.transferred),
                        totalSize: bytes(dlState.size.total),
                        percentage: (100*(dlState.percent)).toFixed(2),
                        elapsed: convertSec(Math.ceil((dlState.time.elapsed))),
                        remaining: convertSec(Math.ceil((dlState.time.remaining)))
                    }
                    if(this.comp.state.status == 'PAUSED') {
                        this.heldState.status = 'PAUSED'
                    }
                    this.comp.setState(this.heldState)
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
                this.comp.setState(this.heldState)
                this.closed = true
                this.dlReq.abort()
                console.log(err)
            }).on('end', () => {
                if(!this.closed) {
                    new Notification('Download Complete', {
                        body: this.animeFilename+' has finished downloading'
                    })
                    this.heldState = {
                        status: 'COMPLETED',
                        speed: '',
                        progressSize: this.comp.state.totalSize,
                        percentage: '100',
                        remaining: '0 sec'
                    }
                    this.comp.setState(this.heldState)
                    store.dispatch({
                        type: "COMPLETED_DOWNLOAD",
                        payload: {
                            animeFilename: this.animeFilename,
                            totalSize: this.comp.state.totalSize,
                            elapsed: this.comp.state.elapsed
                        }
                    })
                } else {
                    console.log("closed")
                }
            }).pipe(dlp)
        }
    }
    this.delete = () => {
        if(this.dlReq) {
            this.closed = true
            this.dlReq.abort()
        }
    }
    this.pause = () => {
        this.dlReq.pause()
    }
    this.continue = () => {
        this.dlReq.resume()
    }
}

