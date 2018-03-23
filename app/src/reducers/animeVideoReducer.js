import React from 'react'

export default function reducer(state = {
    showSideNav: true,
    watching: false,
    fixWidth: 1,
    currentTime: 0
}, action) {
    switch(action.type) {
        case "PLAY_ANIME": {
            return Object.assign({}, state, {
                watching: true
            })
        }
        case "TOGGLE_SIDENAV": {
            return Object.assign({}, state, {
                showSideNav: !state.showSideNav
            })
        }
        case "HIDE_SIDENAV": {
            return Object.assign({}, state, {
                showSideNav: false
            })
        }
        case "SHOW_SIDENAV": {
            return Object.assign({}, state, {
                showSideNav: true
            })
        }
        default: return state
    }
}
