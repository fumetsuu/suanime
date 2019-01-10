import rp from 'request-promise'
import { statusCodeToText } from '../../../util/animelist'

const endpoint = (username, offset) => `https://myanimelist.net/animelist/${username}/load.json?offset=${offset}`

export function getList(username) {
	var listInfo = { 'Currently Watching': 0, 'Completed': 0, 'On Hold': 0, 'Dropped': 0, 'Plan to watch': 0 }

	return new Promise((resolve, reject) => {
		
	})
	
	function getListRecursive(offset) {
		return new Promise((resolve, reject) => {
			rp({ uri: endpoint(username, offset), json: true }).then(data => {
				var processedData = data.map(animeEl => {
					listInfo[statusCodeToText(animeEl.status)] += 1
					var processedImagePath = animeEl.anime_image_path.replace('r/96x136/', '').split('?s=')[0]
					animeEl.anime_image_path = processedImagePath
					return animeEl
				})
				return resolve(processedData)
			}).catch(reject)
		})
	}
}
