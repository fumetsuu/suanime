const defaultState = {
	listdata: null,
	listinfo: null,
	persistedMAL: {
		listStatus: 1,
		listSort: 'TITLE',
		listView: 'COMPACT'
	}
}

export default function reducer(state = defaultState, action) {
	switch(action.type) {
		case 'SAVE_LIST_MALReadonly': {
			global.estore.delete('listdata')
			global.estore.delete('listInfo')
			var { listdata, listinfo } = action.payload
			global.estore.set({
				listdata,
				listinfo
			})
			return Object.assign({}, state, {
				listdata,
				listinfo
			}
			)
		}
		case 'PERSIST_MALReadonly': {
			let { listStatus, listSort, listView } = action.payload
			var persistedMAL = { listStatus, listSort, listView }
			return Object.assign({}, state, { persistedMAL })
		}
		case 'KILL_MALReadonly': {
			global.estore.delete('mal-readonly')
			global.estore.delete('listdata')
			global.estore.delete('listinfo')
			return defaultState
		}
		case 'HYDRATE_LIST_MALReadonly': {
			let { listdata, listinfo } = action.payload
			return Object.assign({}, state, {
				listdata,
				listinfo
			})
		}
		default: return state
	}
}