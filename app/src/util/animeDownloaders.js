const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const request = require('request')
const progress = require('request-progress')
const cheerio = require('cheerio')

export function streamMoe(masteraniWatchURL, animeFilename) {

rp(masteraniWatchURL)
	.then(body => {
		var streamdataformat = /var args = (.*)/g
		var match = streamdataformat.exec(body)
		var streamdata = JSON.parse(
			match[0]
				.split('args = ')[1]
				.replace(/anime: {/, '"anime": {')
				.replace(/mirrors: \[/, '"mirrors": [')
				.replace(/auto_update: \[/, '"auto_update": [')
		)
		var animeName = streamdata.anime.info.title
		var epNumber = streamdata.anime.episodes.current.episode
		var workingMirror
		streamdata.mirrors.some(mirror => {
			if (mirror.quality == 480 && mirror.host_id == 19) {
				workingMirror = mirror
				workingMirror.host['link_url'] = 'https://stream.moe/'
				return true
			}
			return false
		})
		console.log(workingMirror)
        var embedURL = workingMirror.host.link_url + workingMirror.embed_id
        var downloadURL
		rp(embedURL).then(body => {
			var moeHTML = cheerio.load(body)
            downloadURL = moeHTML('.first ~ td > a').attr('href')
            var dlp = fs.createWriteStream(path.join(__dirname, '../downloads/'+animeFilename))
            progress(request(downloadURL), data => {
                console.log('oh', data)
            }).on('progress', (state => {
                console.log(state)
            })).on('error', err => {
                console.log(err)
            }).on('end', () => {
                alert('bye...')
                console.log('done o .. o')
            }).pipe(dlp)
		})
	})
	.catch(err => console.log(err))
}