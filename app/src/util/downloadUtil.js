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
	return {
		next: data => {
			if(data.time) {
				filesize = bytes(data.total.filesize)
				downloadEmitter.emit(key, { type: 'data', data })
			}
		},
		error: error => downloadEmitter.emit(key, { type: 'error', error}),
		complete: () => {
			var completedProps = genCompletedProps(filesize)
			var { completeDL } = require('../actions/actions')
			store.dispatch(completeDL(key, completedProps))
			downloadEmitter.emit(key, { type: 'complete' })
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