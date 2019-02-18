const util = require('util')
const EventEmitter = require('events').EventEmitter

class DownloadEmitter {
	constructor() {
		util.inherits(DownloadEmitter, EventEmitter)
	}
}

const downloadEmitter = new DownloadEmitter()

const downloadObserver = key => {
	return {
		next: data => {
			if(data.time) {
				downloadEmitter.emit(key, { type: 'data', data })
			}
		},
		error: error => downloadEmitter.emit(key, { type: 'error', error}),
		complete: () => downloadEmitter.emit(key, { type: 'complete' })
	}
}

module.exports = {
	downloadEmitter,
	downloadObserver
}