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

export function launchInfo(animeName, posterImg, slug, animeID) {
	return {
	type: 'LAUNCH_INFO',
		payload: {
			animeName: animeName,
			posterImg: posterImg,
			slug: slug,
			animeID: animeID
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