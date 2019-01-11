import { convertMS, fixYear } from './util.js'

export function statusToCode(airingString) {
	switch(airingString) {
		case 'Currently Airing': case 'currently_airing': return 1
		case 'Finished Airing': case 'finished_airing': return 2
		case 'Not yet aired': case 'not_yet_aired': return 3
	}
}

export function typeToCode(typeString) {
	switch(typeString.toUpperCase()) {
		case 'TV': return 1
		case 'OVA': return 2
		case 'Movie': return 3
		case 'Special': return 4
		case 'ONA': return 5
		case 'Music': return 6
		default: return 1
	}
}

export function typeCodeToText(typeCode) {
	switch(typeCode) {
		case 1: return 'TV'
		case 2: return 'OVA'
		case 3: return 'Movie'
		case 4: return 'Special'
		case 5: return 'ONA'
		case 6: return 'Music'
	}
}

export function progressPercent(watched, total) {
	if(total) {
		return Math.ceil(100 * (watched / total)) >= 100 ? 100 : Math.ceil(100 * (watched / total))
	} else if(watched < 12) {
		return Math.ceil(100 * (watched / 13))
	} else return 50
}

export function statusCodeToText(statusCode) {
	switch(statusCode) {
		case 1: return 'Currently Watching'
		case 2: return 'Completed'
		case 3: return 'On Hold'
		case 4: return 'Dropped'
		case 6: return 'Plan to watch'
	}
}


export function statusColour(statusCode) {
	switch(statusCode) {
		case 1: return '#51e373'
		case 2: return '#53b4ff'
		case 3: return '#f55353'
	}
}

export function makeLastUpdated(lastUpdated) {
	return convertMS((Date.now() - (1000 * lastUpdated)))
}

export function guessAired(startDate, seriesEps) {
	var startDate = Date.parse(startDate)

	var japanDate = new Date().getTime()+9*60*60*1000 //add 9 hours, getTime() is GMT

	var deltaMS = japanDate-startDate

	var daysSinceStart = deltaMS/(1000*60*60*24) //divide by 1 day in milliseconds
	
	var guessEps = Math.ceil(daysSinceStart / 7)

	var percentAired = 100*(guessEps / seriesEps)

	percentAired = percentAired == 'Infinity' ? 0 : percentAired
	percentAired = percentAired > 100 ? 100 : percentAired

	return percentAired
}

export function calcUpdateInterval(lastUpdated) {
	var secondsAgo = (Date.now() / 1000) - lastUpdated
	if(secondsAgo < 3600) { //less than an hour
		return 50000
	}
	if(secondsAgo >= 3600 && secondsAgo < 86400) {
		return 3000000
	}
	return null
}

export function dateToSeason(date) {
	var year = parseInt(date.split('-')[0]),
		month = parseInt(date.split('-')[1]),
		day = parseInt(date.split('-')[2])
	//winter 1,2,3 | spring 4,5,6 | summer 7,8,9 | fall 10, 11, 12
	var midMonths = [2, 5, 8, 11]
	var lastMonths = [3, 6, 9, 12]
	var seasonMonth = month
	var seasonMonth = midMonths.includes(month) && day > 15 ? month+1 : month
	seasonMonth = lastMonths.includes(month) ? month+1 : month
	if(seasonMonth > 12) {
		seasonMonth = 1
		year++
	}
	if(seasonMonth > 0 && seasonMonth <= 3) {
		return `Winter ${year}`
	}
	if(seasonMonth > 3 && seasonMonth <= 6) {
		return `Spring ${year}`
	}
	if(seasonMonth > 6 && seasonMonth <= 9) {
		return `Summer ${year}`
	}
	if(seasonMonth > 9 && seasonMonth <= 12) {
		return `Fall ${year}`
	}
}

export function dateMDYToYMD(date) {
	if(!date || !date.includes('-')) return null
	var year = parseInt(date.split('-')[2]),
		month = parseInt(date.split('-')[0]),
		day = parseInt(date.split('-')[1])
	var newYear = fixYear(year)
	return `${newYear}-${month}-${day}`
}

export function getDateInts(date) {
	if(!date || !date.includes('-')) return null
	var year = parseInt(date.split('-')[2]),
		month = parseInt(date.split('-')[0]),
		day = parseInt(date.split('-')[1])
	return { year, month, day }
}

//return result of d1 > d2
export function cmpDateInts(d1, d2) {
	if(!d1 || !d2) return false
	if(fixYear(d1.year) > fixYear(d2.year)) return true
	if(fixYear(d1.year) < fixYear(d2.year)) return false
	if(d1.month > d2.month) return true
	if(d1.month < d2.month) return false
	if(d1.day > d2.day) return true
	return false
}

export function myStatusToColour(myStatus) {
	switch(myStatus) {
		case 1: case 'Currently Watching': return 'blue-bg'
		case 2: case 'Completed': return 'green-bg'
		case 3: case 'On Hold': return 'yellow-bg'
		case 4: case 'Dropped': return 'red-bg'
		case 6: case 'Plan to watch': return 'grey-bg'
	}
}