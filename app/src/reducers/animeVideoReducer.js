import React from 'react'

export default function reducer(state = {
    videoFile: null,
    animeName: null,
    epNumber: null,
    showSideNav: true,
    watching: false,
    fixWidth: 1,
    currentTime: 0
}, action) {
    switch(action.type) {
        case "PLAY_ANIME": {
            console.log(action)
            return Object.assign({}, state, {
                videoFile: action.payload.videoFile,
                animeName: action.payload.animeName,
                epNumber: action.payload.epNumber,
                posterImg: action.payload.posterImg,
                slug: action.payload.slug,
                watching: true,
                showSideNav: false
            })
        }
        case "TOGGLE_SIDENAV": {
            return Object.assign({}, state, {
                showSideNav: !state.showSideNav
            })
        }
        default: return state
    }
}
