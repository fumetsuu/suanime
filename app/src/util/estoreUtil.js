import fs from 'fs'
import path from 'path'

import store from '../store.js'
// import popura from 'popura'
// const pclient = popura()
const tempcwd = require('electron').remote.app.getPath('userData')
global.tempDLPath = path.join(tempcwd, '/downloads/')

import { downloadObserver } from '../util/downloadEmitter'
import { sudPath } from 'su-downloader3'

export function initialiseDB() {
	if(!global.estore.get('sudownloaderSettings')) {
		global.estore.set('sudownloaderSettings', {})
	} //legacy support

	let { maxConcurrentDownloads, autoStart } = global.estore.get('sudownloaderSettings')

	global.suDScheduler.options.maxConcurrentDownloads = maxConcurrentDownloads
	global.suDScheduler.options.autoQueue = autoStart

	// suDownloader.populateState()

	if(!isInitialised()) {
		global.estore.set('initialised', 'true')
		global.estore.set('storedDownloadsArray', [])
		global.estore.set('storedCompletedArray', [])
		global.estore.set('storedClearedArray', [])
		global.estore.set('storedDownloading', [])
		global.estore.set('storedCompleted', [])
		global.estore.set('malhistory', [])
		global.estore.set('downloadHD', true)
		global.estore.set('sudownloaderSettings', {
			maxConcurrentDownloads: 4,
			autoQueue: true,
			autoStart: true
		})
		global.estore.set('usepagination', false)
		global.estore.set('downloadsPath', path.join(tempcwd, '/downloads/'))
	} 
	store.dispatch({
		type: 'HYDRATE_DOWNLOADS',
		payload: {
			downloadsArray: global.estore.get('storedDownloadsArray'),
			completedArray: global.estore.get('storedCompletedArray'),
			clearedArray: global.estore.get('storedClearedArray'),
			downloading: global.estore.get('storedDownloading'),
			completed: global.estore.get('storedCompleted')
		}
	})
	if(global.estore.get('listdata') && global.estore.get('listinfo')) {
		store.dispatch({
			type: 'HYDRATE_LIST_MALReadonly',
			payload: {
				listdata: global.estore.get('listdata'),
				listinfo: global.estore.get('listinfo')
			}
		})
	}
	// if(global.estore.get('mal')) {
	// 	let { user, pass } = global.estore.get('mal')
	// 	pclient.setUser(user, pass)
	// 	store.dispatch({
	// 		type: 'SET_CLIENT',
	// 		payload: {
	// 			pclient: pclient
	// 		}
	// 	})
	// 	pclient.getAnimeList()
	// 		.then(res => {
	// 			let { user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch } = res.myinfo
	// 			var listInfo = [user_name, user_watching, user_completed, user_onhold, user_dropped, user_plantowatch]
	// 			var listData = res.list
	// 			store.dispatch({
	// 				type: 'SAVE_LIST',
	// 				payload: { listdata: listData, listinfo: listInfo }
	// 			})
	// 		})
	// 		.catch(err => console.log(err))
	// }
	if(!fs.existsSync(global.estore.get('downloadsPath'))) {
		fs.mkdirSync(global.estore.get('downloadsPath'))
	}
	if(!fs.existsSync(path.join(tempcwd, '/mal-cache/'))) {
		fs.mkdirSync(path.join(tempcwd, '/mal-cache/'))
	}

	//populate suDScheduler
	var taskQueue = global.estore.get('suDSchedulerTasks')
	if(taskQueue) {
		taskQueue.forEach(taskQueueItem => {
			console.log(taskQueueItem)
			var { key, status, params: { locations, options } } = taskQueueItem
			//the download hadn't been started yet
			if(status == 'queued') {
				global.suDScheduler.queueDownload(key, locations, options, downloadObserver(key))
			} else { //resume from .sud path
				global.suDScheduler.queueDownload(key, sudPath(locations.savePath), options, downloadObserver(key))
			}
		})
	}
}

function isInitialised() {
	return global.estore.get('initialised')
}

export function setDownloaderSettings() {
	let { maxConcurrentDownloads, autoQueue, autoStart } = global.estore.get('sudownloaderSettings')

	global.suDScheduler.options.maxConcurrentDownloads = maxConcurrentDownloads
	global.suDScheduler.options.autoStart = autoQueue
}

export function persistSuD3State() {
	var { taskQueue } = global.suDScheduler
	var updatedTaskQueue = taskQueue.map(taskQueueItem => {
		var { key, status, params } = taskQueueItem
		//we don't want the observer as it will not be useful
		return { key, status, params }
	})
	console.log('persistint sud3 state', updatedTaskQueue)
	global.estore.set('suDSchedulerTasks', updatedTaskQueue)
}

