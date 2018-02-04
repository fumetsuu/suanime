import React from 'react'

export default function reducer(state={
    downloadsArray: [],
    downloading: [],
    completed: [],
    completedArray: [],
    dlObjs: []
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
                    epTitle: action.payload.epTitle
                }
            }
            var newDL = action.payload.animeFilename
            global.estore.set("storedDownloadsArray", [...global.estore.get("storedDownloadsArray"), newDLProps])
            global.estore.set("storedDownloading", [...global.estore.get("storedDownloading"), newDL])
            return Object.assign({}, state, {
                //pass props instead of entire component
                downloadsArray: [...state.downloadsArray, newDLProps],
                downloading: [...state.downloading, newDL],
                epLink: action.payload.epLink,
                animeFilename: action.payload.animeFilename,
                posterImg: action.payload.posterImg
            })
        }
        case "COMPLETED_DOWNLOAD": {
            var newDownloading = state.downloading.filter(el => el!=action.payload.animeFilename)
            global.estore.set("storedDownloading", newDownloading)
            var newCompleted = action.payload.animeFilename
            global.estore.set("storedCompleted", [...global.estore.get("storedCompleted"), newCompleted])
            var newCompletedProps
            var newDownloadsArray = state.downloadsArray.filter(el => {
                if(el.props.animeFilename == action.payload.animeFilename) {
                    newCompletedProps = el
                    newCompletedProps.props['totalSize'] = action.payload.totalSize
                    newCompletedProps.props['elapsed'] = action.payload.elapsed
                    return false
                }
                return true
            })
            global.estore.set("storedDownloadsArray", newDownloadsArray)
            var newCompletedArray = [...global.estore.get("storedCompletedArray"), newCompletedProps]
            global.estore.set("storedCompletedArray", newCompletedArray)
            return Object.assign({}, state, {
                downloading: newDownloading,
                completed: [...state.completed, newCompleted],
                downloadsArray: newDownloadsArray,
                completedArray: newCompletedArray
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
            var newDlObjs = state.dlObjs.filter(el => el.id != action.payload.animeFilename)
            return Object.assign({}, state, {
                downloading: newDownloading,
                completed: newCompleted,
                downloadsArray: newDownloadsArray,
                completedArray: newCompletedArray,
                dlObjs: newDlObjs
            })
        }
        case "CREATE_DLOBJ": {
            return Object.assign({}, state, {
                dlObjs: [...state.dlObjs, {
                    id: action.payload.id,
                    dlObj: action.payload.dlObj
                }]
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