import path from 'path'
import cloudscraper from 'cloudscraper'

import SuSimpleCache from 'su-simple-cache'
const tempcwd = require('electron').remote.app.getPath('userData')
const suSimpleCache = new SuSimpleCache().init(path.join(tempcwd, '/ma-img-cache/'))

export function loadMAImage(imageURL) {
	return new Promise((resolve, reject) => {
		if(suSimpleCache.isCachedSync(imageURL)) {
			suSimpleCache.get(imageURL).then(cachedFile => {
				return resolve(cachedFile.data)
			})
		  } else {
			cloudscraper.request({ method: 'GET', url: imageURL, encoding: 'base64' }, (err, _, body) => {
			  if(err) return reject(err)
			  suSimpleCache.set(imageURL, body)
			  return resolve(body)
			})
		}
	})
}