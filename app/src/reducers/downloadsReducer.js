import React from 'react'
import DownloadCard from '../components/DownloadsPage/DownloadCard.jsx'

export default function reducer(state={
    downloadsArray: [],
    downloading: [],
    completed: [],
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
            global.estore.set("storedDownloadsArray", [...global.estore.get("storedDownloadsArray"), newDLProps])
            return Object.assign({}, state, {
                //pass props instead of entire component
                downloadsArray: [...state.downloadsArray, newDLProps],
                downloading: [...state.downloading, action.payload.animeFilename],
                epLink: action.payload.epLink,
                animeFilename: action.payload.animeFilename,
                posterImg: action.payload.posterImg
            })
        }
        case "COMPLETE_DOWNLOAD": {
            return Object.assign({}, state, {
                downloading: state.downloading.filter(el => el != action.payload.animeFilename),
                completed: [...state.completed, action.payload.animeFilename]
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
                downloadsArray: action.payload.downloadsArray
            })
        }
        default: return state
    }
}