

export function createdlObj(animeFilename, newdlObj) {
	return {
		type: 'CREATE_DLOBJ',
		payload: {
			id: animeFilename,
			dlObj: newdlObj
		}
	}
}

export function clearDL(animeFilename) {
	return {
		type: 'CLEAR_DOWNLOAD',
		payload: {
			animeFilename: animeFilename
		}
	}
}

export function playAnime(videoFile, animeName, epNumber, posterImg, slug) {
	return {
		type: 'PLAY_ANIME',
		 payload: {
			videoFile: videoFile,
			animeName: animeName,
			epNumber: epNumber,
			posterImg: posterImg,
			slug: slug
		}
	}
}

export function queueDL(epLink, animeFilename, posterImg, animeName, epTitle) {
	return {
		type: 'QUEUE_DOWNLOAD',
		payload: {
			epLink: epLink,
			animeFilename: animeFilename,
			posterImg: posterImg,
			animeName: animeName,
			epTitle: epTitle
		}
	}
}

export function launchInfo(animeName, slug, animeID, malID) {
	return {
	type: 'LAUNCH_INFO',
		payload: {
			animeName: animeName,
			slug: slug,
			animeID: animeID,
			malID: malID
		}
	}
}

export function completeDL(animeFilename, totalSize, elapsed, completeDate) {
	return {
		type: 'COMPLETED_DOWNLOAD',
		payload: {
			animeFilename: animeFilename,
			totalSize: totalSize,
			elapsed: elapsed,
			completeDate: completeDate
		}
	}
}

export function search(searchValue, searchSort, searchType, searchStatus, searchGenre) {
	return {
		type: "SEARCH",
		payload: {
			searchValue: searchValue,
			searchSort: searchSort,
			searchType: searchType,
			searchStatus: searchStatus,
			searchGenre: searchGenre
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
			malID: malID,
			updatedObj: updatedObjWithTime || updatedObj,
			newStatus: newStatus
		}
	}
}

export function addAnime(malID, animeObj) {
	return {
		type: "ADD_ANIME",
		payload: {
			malID: malID,
			animeObj: animeObj
		}
	}
}

export function savelist(listdata, listinfo) {
	return {
		type: "SAVE_LIST",
		payload: {
			listdata: listdata,
			listinfo: listinfo
		}
	}
}