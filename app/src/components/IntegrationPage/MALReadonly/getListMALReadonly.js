import rp from 'request-promise'
import { statusCodeToText } from '../../../util/animelist'

const endpoint = (username, offset) => `https://myanimelist.net/animelist/${username}/load.json?offset=${offset}`

export default function getListMALReadonly(username) {
	var listInfo = { 'user_name': username, 'Currently Watching': 0, 'Completed': 0, 'On Hold': 0, 'Dropped': 0, 'Plan to watch': 0 }

	return new Promise((resolve, reject) => {
		getListRecursive(0, []).then(listData => {
			return resolve({
				listInfo,
				listData
			})
		}).catch(reject)
	})
	
	function getListRecursive(offset, accData) {
		return new Promise((resolve, reject) => {
			rp({ uri: endpoint(username, offset), json: true }).then(data => {
				var processedData = data.map(animeEl => {
					listInfo[statusCodeToText(animeEl.status)] += 1
					var processedImagePath = animeEl.anime_image_path.replace('r/96x136/', '').split('?s=')[0]
					animeEl.anime_image_path = processedImagePath
					delete animeEl.anime_studios
					delete animeEl.anime_licensors
					delete animeEl.anime_season
					delete animeEl.has_episode_video
					delete animeEl.has_promotion_video
					delete animeEl.has_video
					delete animeEl.video_url
					return animeEl
				})
				accData = [...accData, ...processedData]
				if(processedData.length == 300) return resolve(getListRecursive(offset + 300, accData))
				return resolve(accData)
			}).catch(reject)
		})
	}
}
