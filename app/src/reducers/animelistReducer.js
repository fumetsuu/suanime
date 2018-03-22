const defaultState = {
    pclient: null,
    listdata: null,
    listinfo: [],
    persistedMAL: {
        listStatus: 1,
        listSort: 'TITLE',
        listView: 'COMPACT'
    }
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
            var storedlistdata = global.estore.get('listdata')
            var storedlistinfo = global.estore.get('listinfo')
            var malID = action.payload.malID
            var updatedObj = action.payload.updatedObj
            var targetAnimeObj = storedlistdata.find(listDataNode => animeFinder(listDataNode, malID))
            var animeIndexInList = storedlistdata.indexOf(targetAnimeObj)
            var newAnimeObj = Object.assign({}, targetAnimeObj, updatedObj)
            var newStatus = action.payload.newStatus
            if(newStatus) {
                let newStatusIndex = newStatus
                if(newStatus==6) { //plan to watch status code is 6 but index in store is 5
                    newStatusIndex = 5
                }
                storedlistinfo[storedlistdata[animeIndexInList].my_status]--
                storedlistinfo[newStatusIndex]++
            }
            storedlistdata[animeIndexInList] = newAnimeObj
            global.estore.set({ 'listdata': storedlistdata, 'listinfo': storedlistinfo})
            return Object.assign({}, state, { listdata: storedlistdata, listinfo: storedlistinfo })
        }
        case 'ADD_ANIME': {
            var storedlistdata = global.estore.get('listdata')
            var storedlistinfo = global.estore.get('listinfo')
            var malID = action.payload.malID
            var animeObj = action.payload.animeObj
            storedlistdata.push(animeObj)
            storedlistinfo[5] = storedlistinfo[5]+1
            global.estore.set({ 'listdata': storedlistdata, 'listinfo': storedlistinfo})
            return Object.assign({}, state, { listdata: storedlistdata, listinfo: storedlistinfo })
        }
        case 'PERSIST_MAL': {
            let { listStatus, listSort, listView } = action.payload
            var persistedMAL = { listStatus, listSort, listView }
            return Object.assign({}, state, { persistedMAL })
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