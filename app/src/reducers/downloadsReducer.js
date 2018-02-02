import React from 'react'
import DownloadCard from '../components/DownloadsPage/DownloadCard.jsx'

export default function reducer(state={
    downloadsArray: []
}, action) {
    switch(action.type) {
        case "INITIATE_DOWNLOAD": {
            console.log(action)
            return Object.assign({}, state, {
                downloadsArray: [...state.downloadsArray, <DownloadCard epLink={action.payload.epLink} animeFilename={action.payload.animeFilename}/>],
                epLink: action.payload.epLink,
                animeFilename: action.payload.animeFilename
            })
        }
        default: return state
    }
}