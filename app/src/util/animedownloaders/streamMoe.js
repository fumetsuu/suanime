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
        console.log('updating state from streammoe.js')
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
                var animeName = streamdata.anime.info.title
                var epNumber = streamdata.anime.episodes.current.episode
                var workingMirror
                streamdata.mirrors.some(mirror => {
                    if (mirror.quality == 480 && mirror.host_id == 19) {
                        workingMirror = mirror
                        workingMirror.host['link_url'] = 'https://stream.moe/'
                        return true
                    }
                    return false
                })
                console.log(workingMirror)
                var embedURL = workingMirror.host.link_url + workingMirror.embed_id
                var downloadURL
                rp(embedURL).then(body => {
                    var moeHTML = cheerio.load(body)
                    downloadURL = moeHTML('.first ~ td > a').attr('href')
                    var dlp = fs.createWriteStream(path.join(__dirname, '../downloads/'+this.animeFilename))
                    this.dlReq = request(downloadURL)
                    progress(this.dlReq, { throttle: 500 }).on('progress', (dlState => {
                        //console.log(dlState)                        
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
                            this.comp.setState(this.heldState)
                        }
                    })).on('error', err => {
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
                }, err => {
                    if(err) {
                        this.heldState.status = "ERROR"
                        this.comp.setState(this.heldState)
                    console.log("probably an error on the video server's side", err)
                        
                    }
                })
            })
            .catch(err => console.log(err))
    }
    this.delete = () => {
        this.closed = true
        this.dlReq.abort()
    }
}

