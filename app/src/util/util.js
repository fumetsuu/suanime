const path = require('path')

export function convertMS(ms) {
    var d, h, m, s, Mo, y
    s = Math.floor(ms / 1000)
    m = Math.floor(s / 60)
    s = s % 60
    h = Math.floor(m / 60)
    m = m % 60
    d = Math.floor(h / 24)
    h = h % 24
    Mo = Math.floor(d / 30)
    y = Math.floor(d / 365)
    if(y!=0) {
        y = Math.round(d / 365)
        return y == 1 ? '1 Year' : `${y} Years`
    }
    if(Mo!=0) {
        Mo = Math.round(d / 30)
        return Mo == 12 ? '1 year' : Mo == 1 ? '1 Month' : `${Mo} Months`
    }
    if(d!=0) {
        if(h >= 12) {
            d++
        }
        return d == 1 ? `Yesterday` : `${d} Days`
    }
    if(h!=0) {
        return h == 1 ? `${h} Hour` : `${h} Hours`
    }
    if(m!=0) {
        return m == 1 ? `${m} Minute` : `${m} Minutes`
    }
    return 'Moments Ago'
}

export function convertSec(sec) {
    var d, h, m, s
    m = Math.floor(Math.round(sec) / 60)
    s = sec % 60;
    h = Math.floor(m / 60)
    m = m % 60;
    d = Math.floor(h / 24)
    h = h % 24;
    return  (d == 0 ? '' : `${d} days `) +
            (h == 0 ? '' : `${h} hrs `) +
            (m == 0 ? '' : `${m} min `) +
            (s == 0 ? '' : `${s} sec `)
}

export function momentDuration(sec) {
    if(sec==0) return '00:00'
    var h, m, s
    m = Math.floor(sec / 60)
    s = Math.round(sec % 60)
    h = Math.floor(m / 60)
    m = Math.round(m % 60)
    h = Math.round(h % 24)
    let formattedDuration = ''
    formattedDuration += h > 0 ? h.toString().padStart(2, '0') : ''
    formattedDuration += (h>0 && m==0) ? ':00' : ((h>0 && m>0) ? ':'+m.toString().padStart(2, '0') : ((m > 0) ? m.toString().padStart(2, '0') : '00'))
    formattedDuration += ':'+s.toString().padStart(2, '0')
    return formattedDuration
}

export function fixURL(url) {
    return encodeURIComponent(url.replace(/\//g, ""))
}

export function replaceSlash(url) {
    return url.replace(/\//g, '\\/')
}

export function fixURLMA(url) {
    return encodeURIComponent(url.replace(/\//g, "").substr(0, 25))
}

export function fixFilename(filename) {
    return filename.replace(/[/\\?%*:|"<>]/g, '')
}

export function genFilename(animeName, episode) {
    return fixFilename(`${animeName} - ${episode}.mp4`)
}

export function genFolderPath(animeName) {
    return path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}`)    
}

export function genVideoPath(animeName, animeFilename) {
    return path.join(global.estore.get('downloadsPath'), `${fixFilename(animeName)}/${animeFilename}`)
}

export function toWordDate(date) {
    if(isNaN(date)) {
        if(date.includes('-')) {
            return toWordDateLegacy(date)
        }
        if(date.includes('/')) {
            var fixedDate = date.split(',')[0].split('/').reverse().join('-')+date.split(',')[1]
            return toWordDateLegacy(fixedDate.toString())
        }
    }
    let unixdate = new Date(date)
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[unixdate.getMonth()]} ${unixdate.getDate()}, ${unixdate.toLocaleTimeString('en-US')} ${unixdate.getFullYear()}`
}

function toWordDateLegacy(date) {
    let unixdate = new Date(Date.parse(date))
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[unixdate.getMonth()]} ${unixdate.getDate()}, ${unixdate.toLocaleTimeString('en-US')} ${unixdate.getFullYear()}`
}

export function fixDirPath(folderpath) {
    return folderpath.replace(/\\\\/g, '/')
}

export function seasonFromDate() {
    let today = new Date()
    let year = today.getUTCFullYear()
    let month = today.getUTCMonth()
    let season
    if(0 <= month && month < 3) {
        season = 'Winter'
    }
    if(3 <= month && month < 6) {
        season = 'Spring'
    }
    if(6 <= month && month < 9) {
        season = 'Summer'
    }
    if(9 <= month && month < 12) {
        season = 'Fall'
    }
    return  { year, season }
}

export function isLeftover(Cyear, Cseason, startdate) {
    let [ year, month, date ] = startdate.split('-')
    if(parseInt(year) < Cyear) {
        return true
    }
    let Cseasonstartmonth 
    switch(Cseason) {
        case 'Winter': Cseasonstartmonth = 1; break
        case 'Spring': Cseasonstartmonth = 3; break
        case 'Summer': Cseasonstartmonth = 6; break
        case 'Fall': Cseasonstartmonth = 9; break
    }
    if(parseInt(month)<Cseasonstartmonth) {
        return true
    }
    return false
}

export function dayToString(day) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    if(day == 0) return 'Today'
    if(day == 1) return 'Tomorrow'
    //where day = 0 is TODAY
    //if today is wednesday, todayrealday is 3, but day is 0
    return days[(day+new Date().getDay())%7]
}

export function toAMPM(time) {
    if(time.timeInHours) {
        return toAMPM(Math.floor(time.timeInHours)+':'+Math.round(60*(time.timeInHours - Math.floor(time.timeInHours))).toString().padStart(2, '0'))
    }
    if(parseInt(time.split(':')[0])<12) return time.split(':')[0]+':'+time.split(':')[1].toString().padStart(2, '0')+' AM'
    if(parseInt(time.split(':')[0])==12) return time.split(':')[0]+':'+time.split(':')[1].toString().padStart(2, '0')+' PM'
    return parseInt(time.split(':')[0])-12+':'+time.split(':')[1].toString().padStart(2, '0')+' PM'
}

export function dayofweekFromDayandTime(day, time) { 
    if(time == '?') {
        return day
    }
    let { dayChange } = fixTzOffset(time)
    if(day == 6 && dayChange == 1) {
        return 0
    }
    if(day == 0 && dayChange == -1) {
        return 6
    }
    return day + dayChange
}

export function fixTzOffset(time) {
    //time is GMT 0 00:00:00 format 
    const timezoneOffsetHrs = new Date().getTimezoneOffset() / 60
    var timeInHours = Number(time.split(':')[0])+(Number(time.split(':')[1]) / 60)
    var localisedTimeInHours = timeInHours - timezoneOffsetHrs
    if(localisedTimeInHours < 0) {
        return {
            timeInHours: 24 + localisedTimeInHours,
            dayChange: -1
        }
    }
    if(localisedTimeInHours > 24) {
        return {
            timeInHours: localisedTimeInHours - 24,
            dayChange: 1
        }
    }
    return {
        timeInHours: localisedTimeInHours,
        dayChange: 0
    }
}