const rp = require('request-promise')
const unpackStreamango = require('./unpackSM')

export function getDownloadLink(epLink, getHD) {
    return new Promise((resolve, reject) => {
        rp(epLink)
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

            var mirrorsPromises = [
				() => getStreamMoeURL(streamdata),
                () => getRapidvideoURL(streamdata),
				() => getStreamangoURL(streamdata),
                () => getmp4UploadURL(epLink),
                () => getAikaURL(body)
            ]

            pAny(mirrorsPromises).then(link => {
                console.log(link)
                return resolve(link)
            }).catch(err => reject(err))

        })
    })
    
    function getStreamMoeURL(streamdata) {
        return new Promise((resolve, reject) => {
            if(getHD) {
                var workingMirror = streamdata.mirrors.find(mirror => mirror.host.id == 19)   
            } else {
                var workingMirror = streamdata.mirrors.reverse().find(mirror => mirror.host.id == 19)
            }
            if(!workingMirror) return reject('ERR 404')
            var embedURL = 'https://stream.moe/' + workingMirror.embed_id
            rp(embedURL).then(body => {
				var linkRegex = /<a href="(.*)" target="_blank">\(download\)<\/a>/
				var downloadURL = linkRegex.exec(body)[1]
				return resolve(downloadURL)
            })
        })
    }

    function getmp4UploadURL(epLink) {
        return new Promise((resolve, reject) => {
            var slug = epLink.split("watch/")[1].split("/")[0]
            var epNumber = epLink.split("watch/")[1].split("/")[1]
            var corsageURL = `https://corsage-sayonara.herokuapp.com/masterani/api/video/?slug=${slug}&ep=${epNumber}`
            rp({ uri: corsageURL, json: true }).then(mirrorsArray => {
                if(getHD) {
                    var workingMirror = mirrorsArray.reverse().find(mirror => mirror.id == 1)
                } else {
                    var workingMirror = mirrorsArray.find(mirror => mirror.id == 1)                    
                }
                if(workingMirror) {
                    var downloadURL = workingMirror.link
                    return resolve(downloadURL)
                }
                return reject('ERR 404')
            }).catch(err => {
                console.log('corsage-sayonara api error', err)
                return reject(err)
            })
        })
    }

    function getAikaURL(pagehtml) {
        return new Promise((resolve, reject) => {
            var videosformat = /var videos = \[(.*)\]/g
            var match = videosformat.exec(pagehtml)
            if(!match) return reject('ERR 404')
            var videosdata = JSON.parse( //array
                '['+match[1]+']'
            )
            var downloadURL
            videosdata.some(el => {
                if(el.label == "HD" && getHD) {
                    downloadURL = el.src
                    return true
                }
                if(el.label == "SD" && !getHD) {
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
            var workingMirror = streamdata.mirrors.find(mirror => mirror.host.id == 21)
            if(!workingMirror) return reject('ERR 404')
            var embedURL = 'https://www.rapidvideo.com/d/' + workingMirror.embed_id
            rp(embedURL).then(body => {
                var linkRegex = /<a href="(.*)" id="button-download"/g
                var links = []
                while((res = linkRegex.exec(body)) !== null) {
                    links.push(res[1])
                }
                if(getHD) return resolve(links[links.length-1])
				return resolve(links[0])
            })
        })
    }

    function getStreamangoURL(streamdata) {
        return new Promise((resolve, reject) => {
            if(getHD) {
                var workingMirror = streamdata.mirrors.find(mirror => mirror.host.id == 18)   
            } else {
                var workingMirror = streamdata.mirrors.reverse().find(mirror => mirror.host.id == 18)
            }
            if(!workingMirror) return reject('ERR 404')
            var embedURL = 'https://streamango.com/embed/' + workingMirror.embed_id
            rp(embedURL).then(body => {
				var linkRegex = /src:d\((.*)\),/
				var rawRes = linkRegex.exec(body)[1].replace(/'/g, '"')
				var packedData = JSON.parse(`[${rawRes}]`)
				console.log(packedData)
				var downloadURL = 'https:'+unpackStreamango(...packedData)
				return resolve(downloadURL)
            })
        })
    }
}

const AggregateError = require('aggregate-error')

function pAny(promiseArray) {
	return new Promise((resolve, reject) => {
		var len = promiseArray.length
		var cn = 0
		var errors = []
		const exec = index => {
			if(index == len-1) return reject(new AggregateError(errors))
			promiseArray[index]().then(
				resolve,
				err => { 
					cn++
					errors.push(err)
					exec(cn)
				}
			)
		}
		exec(cn)
	})
}