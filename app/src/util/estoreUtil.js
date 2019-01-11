import fs from 'fs'
import path from 'path'

import store from '../store.js'
// import popura from 'popura'
// const pclient = popura()
const tempcwd = require('electron').remote.app.getPath('userData')
global.tempDLPath = path.join(tempcwd, '/downloads/')
const suDownloader = require('../suDownloader/suDownloader')

export function initialiseDB() {
	if(!global.estore.get('sudownloaderSettings')) {
		global.estore.set('sudownloaderSettings', {})
	} //legacy support

	let { maxConcurrentDownloads, autoQueue, autoStart } = global.estore.get('sudownloaderSettings')

	suDownloader.setSettings({ maxConcurrentDownloads, autoQueue, autoStart })
	suDownloader.populateState()

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
		suDownloader.clearAll()
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
}

function isInitialised() {
	return global.estore.get('initialised')
}

export function setDownloaderSettings() {
	let { maxConcurrentDownloads, autoQueue, autoStart } = global.estore.get('sudownloaderSettings')

	suDownloader.setSettings({ maxConcurrentDownloads, autoQueue, autoStart })
}




