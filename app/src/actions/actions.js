const path = require('path')
const fs = require('fs')
import { fixFilename, fixURL, genFolderPath, genVideoPath } from '../util/util.js'
import { getDownloadLink } from '../util/getDownloadLink.js'
const pqueueAll = require('../util/pqueueAll')

const suDownloader = require('../suDownloader/suDownloader')
console.log(suDownloader)

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

export function playAnime(animeName, epNumber, posterImg, slug) {
	window.location.hash = `#/watch/${fixFilename(animeName)}/${epNumber}/${posterImg}/${slug}`
}

export function queueDL(epLink, animeFilename, posterImg, animeName, epTitle) {
	if(!fs.existsSync(genFolderPath(animeName))) {
		fs.mkdirSync(genFolderPath(animeName))
	}
	getDownloadLink(epLink, global.estore.get('downloadHD')).then(downloadURL => {
		var concurrent = /mp4upload/.test(downloadURL) ? 1 : 18
		const dlOptions = {
			key: animeFilename,
			path: genVideoPath(animeName, animeFilename),
			url: downloadURL,
			concurrent
		}
		if(concurrent == 1) console.log('WARNING: USING MP4UPLOAD FOR', dlOptions.key, ' EXPECT SLOW SPEEDS AND ERRORS')		
		console.log(suDownloader)
		suDownloader.QueueDownload(dlOptions)
	}).catch(err => {
		if(err) {
			suDownloader.emit('error', { key: animeFilename, err })
		}
	})
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

export function queueDLAll(paramsArray, animeName) {
	if(!fs.existsSync(path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}`))) {
		fs.mkdirSync(path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}`))
	}
	var linkPromises = paramsArray.map(el => () => getDownloadLink(el.epLink))
	pqueueAll(linkPromises).then(downloadURLs => {
		console.log(downloadURLs)
		downloadURLs.forEach((res, i) => {
			if(res.status == 'rejected') {
				suDownloader.emit('error', { key: paramsArray[i].animeFilename, err: res.error })
				return false
			}
			var downloadURL = res.value
			var concurrent = /mp4upload/.test(downloadURL) ? 1 : 18
			const dlOptions = {
				key: paramsArray[i].animeFilename,
				path: path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}/${fixFilename(paramsArray[i].animeFilename)}`),
				url: downloadURL,
				concurrent
			}
			if(concurrent == 1) console.log('WARNING: USING MP4UPLOAD FOR', dlOptions.key, ' EXPECT SLOW SPEEDS AND ERRORS')
			console.log(suDownloader)
			suDownloader.QueueDownload(dlOptions)
		})
	})
	return {
		type: 'QUEUE_ALL',
		payload: paramsArray
	}
}

export function launchInfo(animeName, slug, animeID, malID) { //animeID is masterani ID
	if(animeID) {
		window.location.hash = `#/info/${fixURL(animeName)}/${slug}/${animeID}`
	} else if(malID) {
		window.location.hash = `#/info/${fixURL(animeName)}/null/null/${malID}`
	}
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
		type: "SEARCH",
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
		type: "UPDATE_ANIME",
		payload: {
			malID,
			updatedObj: updatedObjWithTime || updatedObj,
			newStatus
		}
	}
}

export function addAnime(malID, animeObj) {
	return {
		type: "ADD_ANIME",
		payload: {
			malID,
			animeObj
		}
	}
}

export function deleteHistoryCard(malID, episode, timeUpdated) {
	return {
		type: "DELETE_HISTORY_CARD",
		payload: {
			malID,
			episode,
			timeUpdated
		}
	}
}

export function persistMAL(listStatus, listSort, listView) {
	return {
		type: "PERSIST_MAL",
		payload: {
			listStatus,
			listSort,
			listView
		}
	}
}

export function persistDLState(listView, listSort) {
	return {
		type: "PERSIST_DL_STATE",
		payload: {
			listView,
			listSort
		}
	}
}

export function savelist(listdata, listinfo) {
	return {
		type: "SAVE_LIST",
		payload: {
			listdata,
			listinfo
		}
	}
}