import store from '../store.js'

export function sidenavhide() {
    store.dispatch({
        type: 'HIDE_SIDENAV'
    })
}

export function sidenavtoggle() {
    store.dispatch({
        type: 'TOGGLE_SIDENAV'
    })
}

export function sidenavshow() {
    store.dispatch({
        type: 'SHOW_SIDENAV'
    })
}