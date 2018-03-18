const fs = require('fs')
const util = require('util')
const EventEmitter = require('events').EventEmitter
const muxer = require('muxer')
const mtd = require('mt-downloader')

function suDownloadItem(options) {
    util.inherits(suDownloadItem, EventEmitter)

    this.meta = {}

    this.status = 'NOT YET STARTED'
    
    this.options = {
        key: options.key,
        url: options.url,
        path: options.path,
        mtdpath: mtd.MTDPath(options.path),
        range: options.range || 8,
        throttleRate: options.throttleRate || 501,
        retry: options.retry || 5
    }

    this.retried = 0

    this.stats = {
        time: {
            start: 0,
            end: 0
        },
        total: {
            size: 0,
            downloaded: 0,
            completed: 0
        },
        past: {
            downloaded: 0
        },
        present: {
            deltaDownloaded: 0,
            downloaded: 0,
            time: 0,
            speed: 0,
            averageSpeed: 0
        },
        future: {
            remaining: 0,
            eta: 0
        }
    }

    this.start = () => {
        this.status = 'DOWNLOADING'
        let dlopts = this.options
        fs.access(dlopts.mtdpath, err => {
            if(!err) {
                this.downloadFromExisting()
            } else {
                this.initDownloader = mtd.CreateMTDFile({ url: dlopts.url, path: dlopts.path, range: dlopts.range, metaWrite: dlopts.throttleRate }).subscribe(
                    () => {},
                    err => { if(err) throw err },
                    () => { this.downloadFromExisting() }
                )
            }

            this.calculateStartTime()
        })
    }

    this.downloadFromExisting = () => {
        this.status = 'DOWNLOADING'
        let dlopts = this.options
        this.mtDownloader = mtd.DownloadFromMTDFile(dlopts.mtdpath)
        let [{response$, meta$}] = muxer.demux(this.mtDownloader, 'response$', 'meta$')

        response$
        .take(1)
        .subscribe(
            x => {
                this.emit('start', x)
            },
            err => {
                this.handleError(err)
            }
        )
        
        meta$
        .take(1)
        .subscribe(
            response => {
                this.calculateInitialStats(response)
            },
            err => { 
                this.handleError(err)
            }
        )

        this.progressSubscription = meta$
        .throttle(dlopts.throttleRate)
        .subscribe(
            response => {
                this.calculateStats(response)
            },
            err => { 
                this.handleError(err)
             },
            () => {
                this.handleFinishDownload()
            }
        )

    }

    this.pause = () => {
        this.status = 'PAUSED'
        if(this.progressSubscription) {
            this.progressSubscription.dispose()
        }
    }

    this.restart = () => {
        this.pause()
        this.downloadFromExisting()
    }

    //region STATS CALCULATION FUNCTIONS
    this.calculateInitialStats = data => {
        let { range, totalBytes, threads, offsets } = data
        this.meta = { range, totalBytes, threads, offsets }
        this.calculateStartTime()
        this.calculatePastDownloaded()
        this.calculateTotalSize()
    }

    this.calculateStats = data => {
        if(!data.range) return null
        let { range, totalBytes, threads, offsets } = data
        this.meta = { range, totalBytes, threads, offsets }
        this.calculateTotalDownloaded()
        this.calculateTotalCompleted()
        this.calculatePresentDownloaded()
        this.calculatePresentTime()
        this.calculateSpeeds()
        this.calculateFutureRemaining()
        this.calculateFutureEta()
        this.emit('progress', this.stats)
    }

    this.handleFinishDownload = () => {
        this.calculateTotalDownloaded()
        this.calculateTotalCompleted()
        this.calculatePresentDownloaded()
        this.calculatePresentTime()
        this.calculateEndTime()
        this.calculateSpeeds()
        this.calculateFutureRemaining()
        this.calculateFutureEta()
        if(this.stats.total.completed < 99.5) {
            if(this.retried < this.options.retry) {
                this.restart()
                this.retried++
            }
        } else {
            fs.rename(this.options.mtdpath, this.options.path, () => { 
                this.emit('finish', this.stats)
             })       
        }
    }

    this.calculateDownloaded = () => {
        let { threads, offsets } = this.meta

        if(!threads) { return 0 }

        let downloaded = 0
        threads.forEach((thread, idx) => {
            downloaded += offsets[idx] - thread[0]
        })

        return downloaded
    }

    this.calculateStartTime = () => {
        if(!this.stats.time.start) {
            this.stats.time.start = Math.floor(Date.now())
        }
    }

    this.calculateEndTime = () => {
        this.stats.time.end = Math.floor(Date.now())
    }

    this.calculatePastDownloaded = () => {
        this.stats.past.downloaded = this.calculateDownloaded()
    }

    this.calculateTotalSize = () => {
        this.stats.total.size = this.meta.totalBytes
    }
    
    this.calculateTotalDownloaded = () => {
        if(!this.stats.total.downloaded) {
            this.stats.present.deltaDownloaded = this.stats.past.downloaded
        } else {
            this.stats.present.deltaDownloaded = this.stats.total.downloaded
        }
        this.stats.total.downloaded = this.calculateDownloaded()
        this.stats.present.deltaDownloaded = this.stats.total.downloaded - this.stats.present.deltaDownloaded
    }

    this.calculateTotalCompleted = () => {
        let { downloaded, size } = this.stats.total
        this.stats.total.completed = (100*downloaded / size).toFixed(2)
    }

    this.calculatePresentDownloaded = () => {
        this.stats.present.downloaded = this.stats.total.downloaded - this.stats.past.downloaded
    }

    this.calculatePresentTime = () => {
        this.stats.present.time = Math.floor(Date.now()) - this.stats.time.start
    }

    this.calculateSpeeds = () => {
        this.stats.present.speed = this.stats.present.deltaDownloaded / (this.options.throttleRate / 1000)
        this.stats.present.averageSpeed = this.stats.present.downloaded / this.stats.present.time
    }

    this.calculateFutureRemaining = () => {
        this.stats.future.remaining = this.stats.total.size - this.stats.total.downloaded
    }

    this.calculateFutureEta = () => {
        this.stats.future.eta = this.stats.future.remaining / (1000 * this.stats.present.averageSpeed)
    }
    //endregion

    this.handleError = err => {
        this.emit('error', err)
        if(this.retried < this.options.retry) {
            this.restart()
            this.retried++
        } else {
            this.pause()
        }
    }
}

module.exports = suDownloadItem