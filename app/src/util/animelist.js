import { convertMS } from './util.js'

export function statusToCode(airingString) {
    switch(airingString) {
        case 'Currently Airing': return 1; break
        case 'Finished Airing': return 2; break
        case 'Not yet aired': return 3; break
    }
}

export function typeToCode(typeString) {
    switch(typeString) {
        case 'TV': return 1; break
        case 'OVA': return 2; break
        case 'Movie': return 3; break
        case 'Special': return 4; break
        case 'ONA': return 5; break
        case 'Music': return 6; break
    }
}

export function typeCodeToText(typeCode) {
    switch(typeCode) {
        case 1: return 'TV'; break
        case 2: return 'OVA'; break
        case 3: return 'Movie'; break
        case 4: return 'Special'; break
        case 5: return 'ONA'; break
        case 6: return 'Music'; break
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
        case 1: return 'Currently Watching'; break
        case 2: return 'Completed'; break
        case 3: return 'On Hold'; break
        case 4: return 'Dropped'; break
        case 6: return 'Plan to watch'; break
    }
}


export function statusColour(statusCode) {
    switch(statusCode) {
        case 1: return '#51e373'; break
        case 2: return '#53b4ff'; break
        case 3: return '#f55353'; break
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