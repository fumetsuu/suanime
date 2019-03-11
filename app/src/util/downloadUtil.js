import bytes from 'bytes'
const util = require('util')
const EventEmitter = require('events').EventEmitter
import store from '../store'

class DownloadEmitter {
	constructor() {
		util.inherits(DownloadEmitter, EventEmitter)
	}
}

const downloadEmitter = new DownloadEmitter()

function downloadObserver(key) {
	var filesize
	var first = true
	return {
		next: data => {
			if(data.time) {
				filesize = bytes(data.total.filesize)
				downloadEmitter.emit(key, { type: 'data', data })
				if(data.total.percentage > 95 && first) {
					first = false
					global.suDScheduler.pauseDownload(key)
					global.suDScheduler.startDownload(key)
				}
			}
		},
		error: error => downloadEmitter.emit(key, { type: 'error', error}),
		complete: () => {
			//run on next tick AFTER su-downloader3 finishes updating its internal state
			//since su-downloader3's downloader observable emits completion before state is updated...
			setTimeout(() => {
				var completedProps = genCompletedProps(filesize)
				var { completeDL } = require('../actions/actions')
				store.dispatch(completeDL(key, completedProps))
				downloadEmitter.emit(key, { type: 'complete' })
			}, 1000)
		}
	}
}

function genCompletedProps(filesize) {
	return {
		status: 'COMPLETED',
		speed: '',
		progressSize: filesize,
		percentage: '100',
		remaining: '0',
		elapsed: '',
		completeDate: Date.now()
	}
}

module.exports = {
	downloadEmitter,
	downloadObserver,
	genCompletedProps
}