const path = require('path')
const fs = require('fs')
import { fixFilename, fixURL } from '../util/util.js'
import { getDownloadLink } from '../util/getDownloadLink.js';

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

export function playAnime(videoFile, animeName, epNumber, posterImg, slug) {
	return {
		type: 'PLAY_ANIME',
		 payload: {
			videoFile,
			animeName,
			epNumber,
			posterImg,
			slug
		}
	}
}

export function queueDL(epLink, animeFilename, posterImg, animeName, epTitle, persistedState = {}) {
	if(!fs.existsSync(path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}`))) {
		fs.mkdirSync(path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}`))
	}
	getDownloadLink(epLink).then(downloadURL => {
		const dlOptions = {
			key: animeFilename,
			path: path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}/${fixFilename(animeFilename)}`),
			url: downloadURL
		}
		console.log(suDownloader)
		suDownloader.QueueDownload(dlOptions)
	})
	return {
		type: 'QUEUE_DOWNLOAD',
		payload: {
			epLink,
			animeFilename,
			posterImg,
			animeName,
			epTitle,
			persistedState
		}
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

export function savelist(listdata, listinfo) {
	return {
		type: "SAVE_LIST",
		payload: {
			listdata,
			listinfo
		}
	}
}