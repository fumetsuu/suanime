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
        case "QUEUE_DOWNLOAD": {
            console.log(action)
            var newDLProps = {
                props: {
                    epLink: action.payload.epLink,
                    animeFilename: action.payload.animeFilename,
                    posterImg: action.payload.posterImg,
                    animeName: action.payload.animeName,
                    epTitle: action.payload.epTitle,
                    started: Date.now()
                }
            }
            var newDL = action.payload.animeFilename
            global.estore.set("storedDownloadsArray", [newDLProps, ...global.estore.get("storedDownloadsArray")])
            global.estore.set("storedDownloading", [newDL, ...global.estore.get("storedDownloading")])
            return Object.assign({}, state, {
                gettingLinks: [newDL, ...state.gettingLinks],
                downloadsArray: [newDLProps, ...state.downloadsArray],
                downloading: [newDL, ...state.downloading]
            })
        }
        case "QUEUE_ALL": {
            var newDLProps = action.payload.map((el, i) => {
                return {
                    props: {
                        epLink: el.epLink,
                        animeFilename: el.animeFilename,
                        posterImg: el.posterImg,
                        animeName: el.title,
                        epTitle: el.epTitle,
                        started: Date.now() + 10*i
                    }
                }
            })
            var newDL = action.payload.map(el => el.animeFilename)
            global.estore.set("storedDownloadsArray", [...newDLProps, ...global.estore.get("storedDownloadsArray")])
            global.estore.set("storedDownloading", [...newDL, ...global.estore.get("storedDownloading")])
            return Object.assign({}, state, {
                gettingLinks: [...newDL, ...state.gettingLinks],
                downloadsArray: [...newDLProps, ...state.downloadsArray],
                downloading: [...newDL, ...state.downloading]
            })
        }
        case "COMPLETED_DOWNLOAD": {
            console.log(action)
            var newDownloading = state.downloading.filter(el => el!=action.payload.animeFilename)
            global.estore.set("storedDownloading", newDownloading)
            var newCompleted = action.payload.animeFilename
            global.estore.set("storedCompleted", [newCompleted, ...global.estore.get("storedCompleted")])
            var newCompletedProps
            var newDownloadsArray = state.downloadsArray.filter(el => {
                if(el.props.animeFilename == action.payload.animeFilename) {
                    newCompletedProps = el
                    return false
                }
                return true
            })
            newCompletedProps.props = Object.assign({}, newCompletedProps.props, { persistedState: action.payload.persistedState })
            global.estore.set("storedDownloadsArray", newDownloadsArray)
            var newCompletedArray = [newCompletedProps, ...global.estore.get("storedCompletedArray")]
            global.estore.set("storedCompletedArray", newCompletedArray)
            return Object.assign({}, state, {
                downloading: newDownloading,
                completed: [newCompleted, ...state.completed],
                downloadsArray: newDownloadsArray,
                completedArray: newCompletedArray
            })
        }
        case "PERSIST_DOWNLOAD": {
            var persistedDLProps = {
                props: {
                    persistedState: action.payload.persistedState
                }
            }
            var newDownloadsArray = state.downloadsArray.map(el => {
                if(el.props.animeFilename == action.payload.animeFilename) {
                    return {
                        props: Object.assign({}, el.props, { persistedState: action.payload.persistedState })
                    }
                } else {
                    return el
                }
            })
            global.estore.set("storedDownloadsArray", newDownloadsArray)
            return Object.assign({}, state, {
                downloadsArray: newDownloadsArray
            })
        }
        case "PERSIST_DL_STATE": {
            let { listView, listSort } = action.payload
            return Object.assign({}, state, {
                persistedDLState: {
                    listView,
                    listSort
                }
            })
        }
        case "CLEAR_DOWNLOAD": {
            var newDownloading = state.downloading.filter(el => el!=action.payload.animeFilename)
            global.estore.set("storedDownloading", newDownloading)
            var newCompleted = state.completed.filter(el => el!=action.payload.animeFilename)
            global.estore.set("storedCompleted", newCompleted)
            var newDownloadsArray = state.downloadsArray.filter(el => el.props.animeFilename != action.payload.animeFilename)
            global.estore.set("storedDownloadsArray", newDownloadsArray)
            var newCompletedArray = state.completedArray.filter(el => el.props.animeFilename != action.payload.animeFilename)
            global.estore.set("storedCompletedArray", newCompletedArray)
            return Object.assign({}, state, {
                downloading: newDownloading,
                completed: newCompleted,
                downloadsArray: newDownloadsArray,
                completedArray: newCompletedArray
            })
        }
        case "CLEAR_ALL_DOWNLOADS": {
            global.estore.set("storedDownloading", [])
            global.estore.set("storedCompleted", [])
            global.estore.set("storedDownloadsArray", [])
            global.estore.set("storedCompletedArray", [])
            global.estore.set("sudownloads", null)
            return Object.assign({}, state, {
                downloading: [],
                completed: [],
                downloadsArray: [],
                completedArray: []
            })
        }
        case "HYDRATE_DOWNLOADS": {
            return Object.assign({}, state, {
                downloadsArray: action.payload.downloadsArray,
                downloading: action.payload.downloading,
                completed: action.payload.completed,
                completedArray: action.payload.completedArray
            })
        }
        default: return state
    }
}