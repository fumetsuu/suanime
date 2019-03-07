const rp = require('request-promise')
const cheerio = require('cheerio')

const HOME_URL = 'https://www.animefreak.tv/'
const dlRegex = /file:"(.*)",\s+/

/*
	returns an array of objects:
		{
			"anime": {
				"title",
				"poster"
			},
			"episode",
			"epLink",
			"timeSince"
		}
*/
function releases() {
	return new Promise((resolve, reject) => {
		rp(HOME_URL).then(res => {
			const $ = cheerio.load(res)
			var releases = $('.animeList .nl-item').map((_, el) => {
				var title = $('img', el).attr('alt')
				var poster = $('img', el).attr('src')
				var episode = parseInt($('.nli-right', el).children().eq(0).text().split('Episode ')[1])
				var epLink = $('.nli-right', el).children().eq(0).attr('href')
				var timeSince = $('.nli-right .release', el).text()
				return {
					"anime": {
						title,
						poster
					},
					episode,
					epLink,
					timeSince
				}
			}).toArray()
			return resolve(releases)
		}).catch(reject)
	})
}

function downloadLink(epLink) {
	return new Promise((resolve, reject) => {
		rp(epLink).then(res => {
			if(dlRegex.test(res)) {
				return resolve(dlRegex.exec(res)[1])
			} else {
				return reject('404')
			}
		}).catch(reject)
	})
}

module.exports = {
	releases,
	downloadLink
}