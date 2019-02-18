import rp from 'request-promise'
import cloudscraper from 'cloudscraper'
import unpackStreamango from './unpackSM'

export function getDownloadLink(epLink, getHD) {
	return new Promise((resolve, reject) => {
		cloudscraper.request({ method: 'GET', url: epLink}, (err, _, body) => {
			if(err) throw err
			var streamdataformat = /:mirrors='(.*)/g
			var match = streamdataformat.exec(body)
			var streamdata = { mirrors: 
				JSON.parse(
					match[0]
						.split(':mirrors=\'')[1]
						.split('\'></video-mirrors>')[0]
				)
			}
			var mirrorsPromises = [
				// () => getTiwikiwiURL(streamdata),
				() => getStreamMoeURL(streamdata),
				() => getRapidvideoURL(streamdata),
				() => getStreamangoURL(streamdata),
				() => getmp4UploadURL(streamdata),
				() => getAikaURL(body)
			]

			pAny(mirrorsPromises).then(link => {
				return resolve(link)
			}).catch(err => reject(err))
		})
	})

	function getMirror(streamdata, hostid) {
		var hostMirrors = streamdata.mirrors.filter(mirror => mirror.host.id == hostid)
		var workingMirror
		if(getHD) {
			workingMirror = hostMirrors.find(mirror => mirror.quality == 1080) || hostMirrors.find(mirror => mirror.quality == 720)
		} else {
			workingMirror = hostMirrors.find(mirror => mirror.quality == 360) || hostMirrors.find(mirror => mirror.quality == 480)
		}
		if(!workingMirror) workingMirror = hostMirrors[0]
		return workingMirror
	}
	
	function getStreamMoeURL(streamdata) {
		return new Promise((resolve, reject) => {
			var workingMirror = getMirror(streamdata, 19)
			if(!workingMirror) return reject('ERR 404 StreamMoe')
			var embedURL = 'https://stream.moe/' + workingMirror.embed_id
			rp(embedURL).then(body => {
				var linkRegex = /<a href="(.*)" target="_blank">\(download\)<\/a>/
				var downloadURL = linkRegex.exec(body)[1]
				return resolve(downloadURL)
			})
		})
	}

	function getmp4UploadURL(streamdata) {
		return new Promise((resolve, reject) => {
			var workingMirror = getMirror(streamdata, 1)
			if(!workingMirror) return reject('ERR 404 MP4UPLOAD')
			var embedURL = 'https://mp4upload.com/embed-' + workingMirror.embed_id + '.html'
			rp(embedURL).then(body => {
				var evalPackedFunctionRegex = /eval\((.*)\)/g
				var evalPackedFunction = evalPackedFunctionRegex.exec(body)[0]

				var mp4uploadLINK = ''

				/* mp4upload stuff, the mp4upload eval js will put the info into a variable named player, the data will be available through player.info */
				function jwplayer(a) {
					return {  setup: function(info) { mp4uploadLINK = info.file  }, addButton: function() {}, on: function() {} }
				}
				eval(evalPackedFunction)
				
				if(mp4uploadLINK) {
					return resolve(mp4uploadLINK)
				} else {
					return reject('ERR 404 MP4UPLOAD')
				}
			}).catch(e => {
				return reject('ERR 404 MP4UPLOAD')
			})
		})
	}

	function getAikaURL(pagehtml) {
		return new Promise((resolve, reject) => {
			var videosformat = /var videos = \[(.*)\]/g
			var match = videosformat.exec(pagehtml)
			if(!match) return reject('ERR 404 Aika')
			var videosdata = JSON.parse( //array
				'['+match[1]+']'
			)
			var downloadURL
			videosdata.some(el => {
				if(el.label == 'HD' && getHD) {
					downloadURL = el.src
					return true
				}
				if(el.label == 'SD' && !getHD) {
					downloadURL = el.src
					return true
				}
				return false
			})
			if(downloadURL) {
				return resolve(downloadURL)
			}
			return reject('ERR 404')
		})
	}

	function getRapidvideoURL(streamdata) {
		return new Promise((resolve, reject) => {
			var workingMirror = getMirror(streamdata, 21)
			if(!workingMirror) return reject('ERR 404 RapidVideo')
			var embedURL = 'https://www.rapidvideo.com/?v=' + workingMirror.embed_id
			rp(embedURL).then(body => {
				var linkRegex = /<source src="(.*)\.mp4"/
				var link = linkRegex.exec(body)[0].split('<source src="')[1].split('"')[0]
				return resolve(link)
			})
		})
	}

	// function getTiwikiwiURL(streamdata) {
	// 	return new Promise((resolve, reject) => {
	// 		var workingMirror = streamdata.mirrors.find(mirror => mirror.host.id == 20)
	// 		if(!workingMirror) return reject('ERR 404 Tiwikiwi')
	// 		var embedURL = 'https://tiwi.kiwi/embed-' + workingMirror.embed_id + '.html'
	// 		rp(embedURL).then(body => {
	// 			var linkRegex = /src:"(.*)\.mp4"/
	// 			var rawRes = linkRegex.exec(body)[1]
	// 			var downloadURL = rawRes + '.mp4'
	// 			console.log(downloadURL)
	// 			return resolve(downloadURL)
	// 		})
	// 	})
	// }

	function getStreamangoURL(streamdata) {
		return new Promise((resolve, reject) => {
			var workingMirror = getMirror(streamdata, 18)
			if(!workingMirror) return reject('ERR 404 Streammango')
			var embedURL = 'https://streamango.com/embed/' + workingMirror.embed_id
			rp(embedURL).then(body => {
				var linkRegex = /src:d\((.*)\),/
				var rawRes = linkRegex.exec(body)[1].replace(/'/g, '"')
				var packedData = JSON.parse(`[${rawRes}]`)
				var downloadURL = 'https:'+unpackStreamango(...packedData)
				return resolve(downloadURL)
			})
		})
	}
}

import AggregateError from 'aggregate-error'

function pAny(promiseArray) {
	return new Promise((resolve, reject) => {
		var len = promiseArray.length
		var cn = 0
		var errors = []
		const exec = index => {
			if(index == len) reject(new AggregateError(errors))
			else {
				promiseArray[index]().then(
					resolve,
					err => { 
						cn++
						errors.push(err)
						exec(cn)
					}
				)
			}
		}
		exec(cn)
	})
}
