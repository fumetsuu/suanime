const fs = require('graceful-fs')
const util = require('util')
const EventEmitter = require('events').EventEmitter
const suD = require('./su-downloader2')

function suDownloadItem(options) {
	util.inherits(suDownloadItem, EventEmitter)

	this.meta = {}

	this.status = 'NOT YET STARTED'
	
	this.options = {
		key: options.key,
		url: options.url,
		path: options.path,
		sudPath: suD.sudPath(options.path),
		throttleRate: options.throttleRate || 500,
		retry: options.retry || 20,
		concurrent: options.concurrent || 4
	}

	this.retried = 0

	this.deltaDownloadedZeroCount = 0

	this.retryTimeouts = []

	this.started = false

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
		if(['DOWNLOADING', 'STARTING'].includes(this.status)) return false
		this.status = 'STARTING'
		let { sudPath, url, throttleRate, concurrent } = this.options
		let dlPath = this.options.path
		fs.access(sudPath, err => {
			if(!err) this.downloadFromExisting()
			else { 
				this.initialSubscription = suD.initiateDownload({ url, path: dlPath, concurrent })
					.subscribe(x => {
						this.setMeta(x)
						this.calculateInitialStats(x)
						this.initialClock = setInterval(this.calculatePresentTime, throttleRate)
						this.started = true
						this.downloadFromExisting()
					},
					this.handleError
					)
			}

			this.calculateStartTime()
		})
	}

	this.downloadFromExisting = () => {
		let { sudPath, throttleRate } = this.options
		const meta$ = suD.startDownload(sudPath)

		this.progressSubscription = meta$
			.subscribe(
				response => {
					this.setMeta(response)
					this.status = 'DOWNLOADING'
					if(!this.updateInterval) {
						if(this.initialClock) clearInterval(this.initialClock)
						if(!this.started) {
							this.calculateInitialStats(response)
							this.started = true
						}
						this.updateInterval = setInterval(this.handleProgress, throttleRate)
					}
				},
				this.handleError,
				this.handleFinishDownload
			)

	}

	this.pause = () => {
		this.clearUpdateInterval()
		this.status = 'PAUSED'
		this.emit('pause')
		if(this.progressSubscription) this.progressSubscription.unsubscribe()
		if(this.initialSubscription) this.initialSubscription.unsubscribe()
	}

	this.clearUpdateInterval = () => {
		if(this.updateInterval) {
			clearInterval(this.updateInterval)
			this.updateInterval = null
		}
	}

	this.clearRetryTimeouts = () => {
		this.retryTimeouts.forEach(clearTimeout)
		this.retryTimeouts = []
	}

	this.clearAllFiles = () => {
		var unlinkPromises = []
		for(var i = 0; i < this.options.concurrent; i++) {
			var partial = suD.partialPath(this.options.path, i)
			if(fs.existsSync(partial)) unlinkPromises.push(fsUnlink(partial))
		}
		return new Promise((resolve, reject) => {
			if(unlinkPromises.length) {
				Promise.all(unlinkPromises).then(() => {
					fs.unlinkSync(this.options.sudPath)
					return resolve()
				}).catch(err => { if(err) return reject(err) })
			} else return resolve()
		})
	}

	this.restart = () => {
		this.pause()
		this.downloadFromExisting()
	}

	this.handleProgress = () => {
		this.calculateStats()
		this.clearRetryTimeouts()
		if(this.stats.present.deltaDownloaded == 0) {
			this.deltaDownloadedZeroCount += 1
		}
		if(this.deltaDownloadedZeroCount == 5) {
			this.restart()
			this.emit('progress', this.stats)
			this.deltaDownloadedZeroCount = 0
		} else {
			this.emit('progress', this.stats)
		}
	}

	//region STATS CALCULATION FUNCTIONS
	this.setMeta = meta => {
		let { filesize, threads, positions } = meta
		this.meta = { filesize, threads, positions }
	}

	this.calculateInitialStats = data => {
		let { filesize, threads, positions } = data
		this.meta = { filesize, threads, positions }
		this.calculateStartTime()
		this.calculatePastDownloaded()
		this.calculateTotalSize()
	}

	this.calculateStats = () => {
		this.calculateTotalDownloaded()
		this.calculateTotalCompleted()
		this.calculatePresentDownloaded()
		this.calculatePresentTime()
		this.calculateSpeeds()
		this.calculateFutureRemaining()
		this.calculateFutureEta()
	}

	this.handleFinishDownload = () => {
		this.calculateTotalDownloaded()
		this.calculateTotalCompleted()
		if (this.stats.total.completed == 100) {
			this.calculatePresentDownloaded()
			this.calculateEndTime()
			this.calculateSpeeds()
			this.calculateFutureRemaining()
			this.calculateFutureEta()
			this.clearUpdateInterval()
			this.emit('finish', this.stats)
		} else {
			this.restart()
		}
	}

	this.calculateDownloaded = () => {
		let { threads, positions } = this.meta

		if(!threads || !positions) { return 0 }

		let downloaded = 0
		threads.forEach((thread, idx) => {
			downloaded += positions[idx] - thread[0]
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
		this.stats.total.size = this.meta.filesize
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
		this.stats.total.completed = 100*downloaded / size
	}

	this.calculatePresentDownloaded = () => {
		this.stats.present.downloaded = this.stats.total.downloaded - this.stats.past.downloaded
	}

	this.calculatePresentTime = () => {
		this.stats.present.time += this.options.throttleRate / 1000
	}

	this.calculateSpeeds = () => {
		this.stats.present.averageSpeed = this.stats.present.downloaded / this.stats.present.time
		this.stats.present.speed = this.stats.present.averageSpeed
	}

	this.calculateFutureRemaining = () => {
		this.stats.future.remaining = this.stats.total.size - this.stats.total.downloaded
	}

	this.calculateFutureEta = () => {
		this.stats.future.eta = this.stats.future.remaining / this.stats.present.averageSpeed
	}
	//endregion

	this.handleError = err => {
		if(this.retried == this.options.retry) {
			this.emit('error', err)
			return false
		}
		if((err.code == 'ENOTFOUND' || err.code == 'ECONNRESET') && fs.existsSync(this.options.sudPath)) {
			var retryTimeout = setTimeout(this.restart, 5000 * (1 + this.retried))
			console.log(err, this.options.path, 'retrying...')
			this.retryTimeouts.push(retryTimeout)
			this.retried++
		} else {
			console.log('err probably no internet or blocked access from download server', err)
			var retryTimeout = setTimeout(this.restart, 5000 * (1 + this.retried))
			console.log(err, this.options.path, 'retrying...')
			this.retryTimeouts.push(retryTimeout)
			this.retried++
		}
	}
}

function fsUnlink(file) {
	return new Promise((resolve, reject) => {
		fs.unlink(file, err => {
			if(err) return reject(err)
			return resolve(true)
		})
	})
}

module.exports = suDownloadItem