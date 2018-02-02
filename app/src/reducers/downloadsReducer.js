import React from 'react'
import DownloadCard from '../components/DownloadsPage/DownloadCard.jsx'

export default function reducer(state={
    downloadsArray: [],
    downloading: [],
    completed: []
}, action) {
    switch(action.type) {
        case "QUEUE_DOWNLOAD": {
            console.log(action)
            return Object.assign({}, state, {
                downloadsArray: [...state.downloadsArray, <DownloadCard epLink={action.payload.epLink} animeFilename={action.payload.animeFilename} posterImg={action.payload.posterImg}/>],
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
        default: return state
    }
}