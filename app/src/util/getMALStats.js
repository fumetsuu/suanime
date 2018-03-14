const rp = require('request-promise')

export function getMALStats(username, cb) {
    const userURL = `https://myanimelist.net/profile/${username}`
    rp(userURL).then(body => {
        var profile = new DOMParser().parseFromString(body, "text/html")
        let totalEntries = parseInt(profile.querySelectorAll('.stats-data.fl-r .di-ib.fl-r')[0].innerText.replace(',', ''))
        let rewatched = parseInt(profile.querySelectorAll('.stats-data.fl-r .di-ib.fl-r')[1].innerText.replace(',', ''))
        let episodes = parseInt(profile.querySelectorAll('.stats-data.fl-r .di-ib.fl-r')[2].innerText.replace(',', ''))
        let days = Number(profile.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.stat-score.di-t.w100.pt8 > div.di-tc.al.pl8.fs12.fw-b').innerText.split("Days: ")[1])
        let mean = Number(profile.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.stat-score.di-t.w100.pt8 > div.di-tc.ar.pr8.fs12.fw-b').innerText.split("Mean Score: ")[1])
        let dateJoined = profile.querySelector('#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4 > li:nth-child(5) > span.user-status-data.di-ib.fl-r').innerText
        const result = { totalEntries, rewatched, episodes, days, mean, dateJoined }
        cb(result, null)
    }).catch(err => { if(err) cb(null, err) })
}