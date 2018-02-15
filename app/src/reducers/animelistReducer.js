const defaultState = {
    pclient: null,
    listdata: null,
    listinfo: []
}

export default function reducer(state = defaultState, action) {
    switch(action.type) {
        case 'SET_CLIENT': {
            return Object.assign({}, state, {
                pclient: action.payload.pclient
            })
        }
        case 'SAVE_LIST': {
            global.estore.delete('listdata')
            global.estore.delete('listInfo')
            global.estore.set({
                listdata: action.payload.listdata,
                listinfo: action.payload.listinfo
            })
            return Object.assign({}, state, {
                listdata: action.payload.listdata,
                listinfo: action.payload.listinfo
                }
            )
        }
        case 'UPDATE_ANIME': {
            console.log('start')
            var start = Date.now()
            var storedlistdata = global.estore.get('listdata')
            var malID = action.payload.malID
            var updatedObj = action.payload.updatedObj
            var targetAnimeObj = storedlistdata.find(listDataNode => animeFinder(listDataNode, malID))
            var animeIndexInList = storedlistdata.indexOf(targetAnimeObj)
            var newAnimeObj = Object.assign({}, targetAnimeObj, updatedObj)
            storedlistdata[animeIndexInList] = newAnimeObj
            global.estore.set('listdata', storedlistdata)

            console.log(storedlistdata[animeIndexInList])
            console.log('end ', Date.now() - start)
            return Object.assign({}, state, { listdata: storedlistdata })
        }
        case 'KILL_MAL': {
            global.estore.delete("mal")
            global.estore.delete("listdata")
            global.estore.delete("listinfo")
            return defaultState
        }
        case 'HYDRATE_LIST': {
            return Object.assign({}, state, {
                listdata: action.payload.listdata,
                listinfo: action.payload.listinfo
            })
        }
        default: return state
    }
}

function animeFinder(listDataNode, malID) {
    return listDataNode.series_animedb_id == malID
}