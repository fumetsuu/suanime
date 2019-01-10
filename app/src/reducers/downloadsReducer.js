import React from 'react'

export default function reducer(state={
	downloadsArray: [],
	downloading: [],
	completed: [],
	completedArray: [],
	gettingLinks: [],
	persistedDLState: {
		listView: 'COMPACT',
		listSort: 'v`ADDED'
	}
}, action) {
	switch(action.type) {
		case 'QUEUE_DOWNLOAD': {
			console.log(action)

			var { epLink, animeFilename, posterImg, animeName, epTitle } = action.payload
			
			var newDL = animeFilename
			var newDLProps = {
				props: {
					epLink,
					animeFilename,
					posterImg,
					animeName,
					epTitle,
					started: Date.now()
				}
			}

			global.estore.set('storedDownloadsArray', [newDLProps, ...global.estore.get('storedDownloadsArray')])
			global.estore.set('storedDownloading', [newDL, ...global.estore.get('storedDownloading')])

			return Object.assign({}, state, {
				gettingLinks: [newDL, ...state.gettingLinks],
				downloadsArray: [newDLProps, ...state.downloadsArray],
				downloading: [newDL, ...state.downloading]
			})
		}

		case 'QUEUE_ALL': {
			var newDL = action.payload.map(el => el.animeFilename)
			var newDLProps = action.payload.map((el, i) => {
				var { epLink, animeFilename, posterImg, title, epTitle } = el
				return {
					props: {
						epLink,
						animeFilename,
						posterImg,
						animeName: title,
						epTitle,
						started: Date.now() + 10*i
					}
				}
			})
			global.estore.set('storedDownloadsArray', [...newDLProps, ...global.estore.get('storedDownloadsArray')])
			global.estore.set('storedDownloading', [...newDL, ...global.estore.get('storedDownloading')])
			return Object.assign({}, state, {
				gettingLinks: [...newDL, ...state.gettingLinks],
				downloadsArray: [...newDLProps, ...state.downloadsArray],
				downloading: [...newDL, ...state.downloading]
			})
		}

		case 'COMPLETED_DOWNLOAD': {
			console.log(action)

			var { animeFilename, persistedState } = action.payload
			var newDownloading = state.downloading.filter(el => el != animeFilename)
			global.estore.set('storedDownloading', newDownloading)
			var newCompleted = animeFilename
			global.estore.set('storedCompleted', [newCompleted, ...global.estore.get('storedCompleted')])
			var newCompletedProps
			var newDownloadsArray = state.downloadsArray.filter(el => {
				if(el.props.animeFilename == animeFilename) {
					newCompletedProps = el
					return false
				}
				return true
			})
			newCompletedProps.props = Object.assign({}, newCompletedProps.props, { persistedState })
			global.estore.set('storedDownloadsArray', newDownloadsArray)
			var newCompletedArray = [newCompletedProps, ...global.estore.get('storedCompletedArray')]
			global.estore.set('storedCompletedArray', newCompletedArray)
			return Object.assign({}, state, {
				downloading: newDownloading,
				completed: [newCompleted, ...state.completed],
				downloadsArray: newDownloadsArray,
				completedArray: newCompletedArray
			})
		}

		case 'PERSIST_DOWNLOAD': {
			var newDownloadsArray = state.downloadsArray.map(el => {
				if(el.props.animeFilename == action.payload.animeFilename) {
					return {
						props: Object.assign({}, el.props, { persistedState: action.payload.persistedState })
					}
				}
				return el
			})
			global.estore.set('storedDownloadsArray', newDownloadsArray)
			return Object.assign({}, state, {
				downloadsArray: newDownloadsArray
			})
		}

		case 'PERSIST_DL_STATE': {
			let { listView, listSort } = action.payload
			return Object.assign({}, state, {
				persistedDLState: {
					listView,
					listSort
				}
			})
		}

		case 'CLEAR_DOWNLOAD': {
			var { animeFilename } = action.payload
			var newDownloading = state.downloading.filter(el => el != animeFilename)
			global.estore.set('storedDownloading', newDownloading)
			var newCompleted = state.completed.filter(el => el!= animeFilename)
			global.estore.set('storedCompleted', newCompleted)
			var newDownloadsArray = state.downloadsArray.filter(el => el.props.animeFilename != animeFilename)
			global.estore.set('storedDownloadsArray', newDownloadsArray)
			var newCompletedArray = state.completedArray.filter(el => el.props.animeFilename != animeFilename)
			global.estore.set('storedCompletedArray', newCompletedArray)
			return Object.assign({}, state, {
				downloading: newDownloading,
				completed: newCompleted,
				downloadsArray: newDownloadsArray,
				completedArray: newCompletedArray
			})
		}

		case 'CLEAR_ALL_DOWNLOADS': {
			global.estore.set('storedDownloading', [])
			global.estore.set('storedCompleted', [])
			global.estore.set('storedDownloadsArray', [])
			global.estore.set('storedCompletedArray', [])
			global.estore.set('sudownloads', null)
			return Object.assign({}, state, {
				downloading: [],
				completed: [],
				downloadsArray: [],
				completedArray: []
			})
		}

		case 'HYDRATE_DOWNLOADS': {
			var { downloadsArray, downloading, completed, completedArray } = action.payload
			return Object.assign({}, state, {
				downloadsArray,
				downloading,
				completed,
				completedArray
			})
		}
		default: return state
	}
}