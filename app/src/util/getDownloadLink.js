const rp = require('request-promise')

export function getDownloadLink(epLink) {
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
    
            getStreamMoeURL(streamdata).then(downloadURL => {
                return resolve(downloadURL)
            }).catch(err => {
                if(err) {
                    getmp4UploadURL(epLink).then(downloadURL => {
                        return resolve(downloadURL)
                    }).catch(err => {
                        if(err) {
                            getAikaURL(body).then(downloadURL => {
                                return resolve(downloadURL)
                            }).catch(err => {
                                return reject(err)
                            })
                        }
                    })
                }
            })
        })
    })
    
    function getStreamMoeURL(streamdata) {
        return new Promise((resolve, reject) => {
            console.log(global.estore.get('downloadHD'), streamdata)
            if(global.estore.get('downloadHD')) {
                var workingMirror = streamdata.mirrors.find(mirror => mirror.host.id == 19)   
            } else {
                var workingMirror = streamdata.mirrors.reverse().find(mirror => mirror.host.id == 19)
            }
            if(!workingMirror) {
                return reject('ERR 404')
            }
            var embedURL = 'https://stream.moe/' + workingMirror.embed_id
            rp(embedURL).then(body => {
                var moeParser = new DOMParser()
                var downloadURL = moeParser.parseFromString(body, "text/html").querySelector('.first ~ td > a').getAttribute('href')
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
                if(global.estore.get('downloadHD')) {
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
            var getHD = global.estore.get('downloadHD')
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
}