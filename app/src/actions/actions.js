import fs from 'fs'
import bytes from 'bytes'

import { fixFilename, fixURL, genFolderPath, genVideoPath, convertSec } from '../util/util'
// import { getDownloadLink } from '../util/getDownloadLink'
import { downloadLink } from '../util/animefreak'
import store from '../store'

import { downloadObserver, downloadEmitter } from '../util/downloadUtil'
import { persistSuD3State } from '../util/estoreUtil'

export function clearDL(animeFilename) {
	return {
		type: 'CLEAR_DOWNLOAD',
		payload: {
			animeFilename: animeFilename
		}
	}
}

export function clearAllDownloads() {
	return {
		type: 'CLEAR_ALL_DOWNLOADS'
	}
}

export function playAnime(animeName, epNumber, posterImg) {
	window.location.hash = `#/watch/${fixFilename(animeName)}/${epNumber}/${encodeURIComponent(posterImg)}`
}

export function queueDL(epLink, animeFilename, posterImg, animeName, epTitle) {
	var vidPath = genVideoPath(animeName, animeFilename)
	//check if file already exists
	if(fs.existsSync(vidPath)) {
		store.dispatch({
			type: 'QUEUE_DOWNLOAD',
			payload: {
				epLink,
				animeFilename,
				posterImg,
				animeName,
				epTitle
			}
		})
		return completeDL(animeFilename, {
			status: 'COMPLETED',
			speed: '',
			progressSize: bytes(fs.statSync(vidPath).size),
			percentage: '100',
			remaining: '0',
			elapsed: convertSec(0),
			completeDate: Date.now()
		})
	}

	if(/masterani/.test(epLink)) return

	if(!fs.existsSync(genFolderPath(animeName))) fs.mkdirSync(genFolderPath(animeName))

	startDownload(epLink, animeFilename, animeName)

	return {
		type: 'QUEUE_DOWNLOAD',
		payload: {
			epLink,
			animeFilename,
			posterImg,
			animeName,
			epTitle
		}
	}
}

export function startDownload(epLink, animeFilename, animeName) {
	console.log(downloadEmitter)
	downloadLink(epLink).then(downloadURL => {
		var vidPath = genVideoPath(animeName, animeFilename)
		var key = animeFilename
		var locations = {
			url: downloadURL,
			savePath: vidPath
		}
		const dlOptions = { threads: 18 }

		global.suDScheduler.queueDownload(key, locations, dlOptions, downloadObserver(key))
		downloadEmitter.emit(animeFilename, { type: 'queued' })
		persistSuD3State()
		console.log(global.suDScheduler.taskQueue)
	}).catch(error => {
		if(error) downloadEmitter.emit(animeFilename, { type: 'error', error })
	})
}

export function queueDLAll(paramsArray, animeName) {
	console.log('not working atm')
	// var animeFolderPath = path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}`)
	// if(!fs.existsSync(animeFolderPath)) fs.mkdirSync(animeFolderPath)

	// var linkPromises = paramsArray.map(el => () => getDownloadLink(el.epLink))

	// pqueueAll(linkPromises).then(downloadURLs => {
	// 	downloadURLs.forEach((res, i) => {
	// 		if(res.status == 'rejected') {
	// 			suDownloader.emit('error', { key: paramsArray[i].animeFilename, err: res.error })
	// 			return
	// 		}
	// 		var downloadURL = res.value
	// 		var concurrent = /mp4upload/.test(downloadURL) ? 1 : 18
	// 		const dlOptions = {
	// 			key: paramsArray[i].animeFilename,
	// 			path: path.join(animeFolderPath, fixFilename(paramsArray[i].animeFilename)),
	// 			url: downloadURL,
	// 			concurrent
	// 		}
	// 		if(concurrent == 1) console.log('WARNING: USING MP4UPLOAD FOR', dlOptions.key, ' EXPECT SLOW SPEEDS AND ERRORS')
	// 		console.log(suDownloader)
	// 		suDownloader.QueueDownload(dlOptions)
	// 	})
	// })

	// return {
	// 	type: 'QUEUE_ALL',
	// 	payload: paramsArray
	// }
}

export function launchInfo(animeName, malID='null', slug, masteraniID) {
	if(slug && masteraniID) {
		window.location.hash = `#/info/${fixURL(animeName)}/${malID}/${slug}/${masteraniID}`
	}
	window.location.hash = `#/info/${fixURL(animeName)}/${malID}`
}

export function completeDL(animeFilename, persistedState) {
	return {
		type: 'COMPLETED_DOWNLOAD',
		payload: {
			animeFilename,
			persistedState
		}
	}
}

export function persistDL(animeFilename, persistedState) {
	return {
		type: 'PERSIST_DOWNLOAD',
		payload: {
			animeFilename,
			persistedState
		}
	}
}

export function search(searchValue, searchSort, searchType, searchStatus, searchGenre) {
	return {
		type: 'SEARCH',
		payload: {
			searchValue,
			searchSort,
			searchType,
			searchStatus,
			searchGenre
		}
	}
}

const timeUpdatableFields = ['my_watched_episodes']

export function updateAnime(malID, updatedObj) {
	if(timeUpdatableFields.some(el => updatedObj[el])) {
		var updatedObjWithTime = Object.assign({}, updatedObj, {
			my_last_updated: Date.now() / 1000
		})
	}

	if(updatedObj['my_status']) {
		var newStatus = updatedObj['my_status']
	}

	return {
		type: 'UPDATE_ANIME',
		payload: {
			malID,
			updatedObj: updatedObjWithTime || updatedObj,
			newStatus
		}
	}
}

export function addAnime(malID, animeObj) {
	return {
		type: 'ADD_ANIME',
		payload: {
			malID,
			animeObj
		}
	}
}

export function deleteHistoryCard(malID, episode, timeUpdated) {
	return {
		type: 'DELETE_HISTORY_CARD',
		payload: {
			malID,
			episode,
			timeUpdated
		}
	}
}

export function persistMAL(listStatus, listSort, listView) {
	return {
		type: 'PERSIST_MAL',
		payload: {
			listStatus,
			listSort,
			listView
		}
	}
}

export function persistDLState(listView, listSort) {
	return {
		type: 'PERSIST_DL_STATE',
		payload: {
			listView,
			listSort
		}
	}
}

export function savelist(listdata, listinfo) {
	return {
		type: 'SAVE_LIST',
		payload: {
			listdata,
			listinfo
		}
	}
}

export function savelistMALReadonly(listdata, listinfo) {
	return {
		type: 'SAVE_LIST_MALReadonly',
		payload: {
			listdata,
			listinfo
		}
	}
}

export function persistMALReadonly(listStatus, listSort, listView) {
	return {
		type: 'PERSIST_MALReadonly',
		payload: {
			listStatus,
			listSort,
			listView
		}
	}
}

export function killMALReadonly() {
	return {
		type: 'KILL_MALReadonly'
	}
}