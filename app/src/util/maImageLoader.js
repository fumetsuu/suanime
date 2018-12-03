const path = require('path')
const cloudscraper = require('cloudscraper')

const SuSimpleCache = require('su-simple-cache')
const tempcwd = require('electron').remote.app.getPath('userData')
const suSimpleCache = new SuSimpleCache().init(path.join(tempcwd, '/ma-img-cache/'))

export function loadMAImage(imageURL) {
	return new Promise((resolve, reject) => {
		if(suSimpleCache.isCachedSync(imageURL)) {
			suSimpleCache.get(imageURL).then(cachedFile => {
				return resolve(cachedFile.data)
			})
		  } else {
			cloudscraper.request({ method: 'GET', url: imageURL, encoding: 'base64' }, (err, res, body) => {
			  if(err) return reject(err)
			  suSimpleCache.set(imageURL, body)
			  return resolve(body)
			})
		}
	})
}